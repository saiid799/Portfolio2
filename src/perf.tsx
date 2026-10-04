import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * Adaptive performance. "full" = all effects. "lite" = no grain / blur blobs / per-letter text
 * animation / parallax / tilt, shorter preloader. The tier is chosen by:
 *   1. a saved result from a previous visit (instant, no flash of jank),
 *   2. device hints: reduced-motion, data-saver, slow network, ≤4 GB RAM, ≤4 CPU cores,
 *   3. a live frame-rate probe during the first seconds — if the page can't hold ~40 fps it drops to lite
 *      (and remembers that for next time).
 */
export type Tier = 'full' | 'lite'

type NetInfo = { saveData?: boolean; effectiveType?: string }

export function hintedLite(): boolean {
  if (typeof window === 'undefined') return false
  // phones & small touch tablets: decorative effects (parallax, tilt, grain, blur) are desktop-oriented anyway
  if (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1024) return true
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: NetInfo }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  if (nav.connection?.saveData) return true
  if (['slow-2g', '2g', '3g'].includes(nav.connection?.effectiveType ?? '')) return true
  if (nav.deviceMemory && nav.deviceMemory <= 4) return true
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return true
  return false
}

const Ctx = createContext<{ tier: Tier; lite: boolean }>({ tier: 'full', lite: false })
export const usePerf = () => useContext(Ctx)

export function PerfProvider({ children }: { children: ReactNode }) {
  // server + first client render are "full" (hydration-safe); the real tier is applied right after mount
  const [tier, setTier] = useState<Tier>('full')

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem('perf')
    } catch {}
    if (saved === 'lite' || (saved !== 'full' && hintedLite())) {
      setTier('lite')
      return
    }

    // frame-rate probe: sample 60 frames after the page settles; sustained <40 fps → lite
    let raf = 0
    let frames = 0
    let start = 0
    let cancelled = false
    const warmup = setTimeout(() => {
      const tick = (t: number) => {
        if (cancelled) return
        if (!start) start = t
        frames++
        const elapsed = t - start
        if (elapsed >= 1200) {
          const fps = (frames * 1000) / elapsed
          if (fps < 40) {
            setTier('lite')
            try {
              localStorage.setItem('perf', 'lite')
            } catch {}
          }
          return
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, 600)

    return () => {
      cancelled = true
      clearTimeout(warmup)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.perf = tier
  }, [tier])

  const value = useMemo(() => ({ tier, lite: tier === 'lite' }), [tier])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
