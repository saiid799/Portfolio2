import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  animate,
  useInView,
  type MotionValue,
} from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../i18n'
import { hintedLite, usePerf } from '../perf'

export const ease = [0.16, 1, 0.3, 1] as const

/* ───────── Preloader: counter + curtain ───────── */
export function Preloader({ onDone }: { onDone: () => void }) {
  const { t } = useI18n()
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    let seen = false
    try {
      seen = sessionStorage.getItem('seen') === '1'
      sessionStorage.setItem('seen', '1')
    } catch {}
    const c = animate(0, 100, {
      duration: seen ? 0.3 : hintedLite() ? 0.7 : 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        setGone(true)
        document.documentElement.style.overflow = ''
        window.scrollTo(0, 0)
        onDone()
      },
    })
    return () => {
      c.stop()
      document.documentElement.style.overflow = ''
    }
  }, [onDone])

  return (
    <m.div
      dir="ltr"
      className="fixed inset-0 z-[100] flex items-end justify-between gap-4 bg-ink p-5 sm:p-12"
      initial={{ y: 0 }}
      animate={gone ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      style={{ pointerEvents: gone ? 'none' : 'auto' }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute sm:text-xs">
        {t.name}
        <br />
        {t.preloader} — {new Date().getFullYear()}
      </div>
      <div className="font-serif text-[26vw] leading-[0.8] text-paper sm:text-[16vw]">
        {String(n).padStart(2, '0')}
        <span className="text-acid">%</span>
      </div>
      <m.div className="absolute inset-x-0 bottom-0 h-1 origin-left bg-acid" style={{ scaleX: n / 100 }} />
    </m.div>
  )
}

/* ───────── Custom cursor (fine pointers only) ───────── */
export function Cursor() {
  const { lite } = usePerf()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const rx = useSpring(x, { stiffness: 140, damping: 18, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 140, damping: 18, mass: 0.6 })
  const [big, setBig] = useState(false)
  const [label, setLabel] = useState('')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (lite || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setEnabled(false)
      return
    }
    setEnabled(true)
    document.body.classList.add('has-cursor')
    const root = document.documentElement
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      root.style.setProperty('--mx', e.clientX + 'px')
      root.style.setProperty('--my', e.clientY + 'px')
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('a,button,[data-cursor]')
      setBig(!!t)
      setLabel(t?.dataset.cursor ?? '')
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      document.body.classList.remove('has-cursor')
    }
  }, [x, y, lite])

  if (!enabled) return null
  return (
    <>
      <m.div
        className="pointer-events-none fixed left-0 top-0 z-[95] h-2 w-2 rounded-full bg-acid"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      />
      <m.div
        className="pointer-events-none fixed left-0 top-0 z-[94] flex items-center justify-center rounded-full border border-acid/70 font-mono text-[10px] uppercase tracking-widest text-ink"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: label ? 88 : big ? 56 : 34,
          height: label ? 88 : big ? 56 : 34,
          backgroundColor: label ? 'rgba(200,255,61,1)' : big ? 'rgba(200,255,61,0.15)' : 'rgba(200,255,61,0)',
        }}
        transition={{ duration: 0.25, ease }}
      >
        {label}
      </m.div>
    </>
  )
}

/* ───────── Scroll progress bar ───────── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <m.div
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-acid rtl:origin-right"
      style={{ scaleX }}
    />
  )
}

/* ───────── Magnetic wrapper ───────── */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.3 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.3 })
  return (
    <m.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </m.div>
  )
}

const ARABIC = /[؀-ۿ]/

/* ───────── Text rise. Latin → per-letter; Arabic → per-word (keeps letters joined) ───────── */
export function SplitLetters({
  text,
  delay = 0,
  className = '',
  start = true,
}: {
  text: string
  delay?: number
  className?: string
  start?: boolean
}) {
  const { lite } = usePerf()
  if (lite) {
    return (
      <m.span
        className={`inline-block ${className}`}
        initial={{ opacity: 0, y: 16 }}
        animate={start ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease, delay: Math.min(delay, 0.6) }}
      >
        {text}
      </m.span>
    )
  }
  const byWord = ARABIC.test(text)
  const tokens = byWord ? text.split(' ') : text.split(/(?<= )/)
  return (
    <span className={className} aria-label={text}>
      {tokens.map((word, wi) => {
        const offset = tokens.slice(0, wi).join(byWord ? ' ' : '').length
        const pieces = byWord ? [word] : word.split('')
        return (
          <span key={wi} className={`inline-block ${byWord ? 'me-[0.25em]' : 'whitespace-nowrap'}`} aria-hidden>
            {pieces.map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={byWord ? { paddingBlock: '0.15em', marginBlock: '-0.15em' } : undefined}>
                <m.span
                  className="inline-block"
                  initial={{ y: '110%', rotate: byWord ? 0 : 8 }}
                  animate={start ? { y: 0, rotate: 0 } : undefined}
                  transition={{ duration: 1, ease, delay: delay + (byWord ? wi * 0.12 : (offset + i) * 0.045) }}
                >
                  {ch === ' ' ? ' ' : ch}
                </m.span>
              </span>
            ))}
          </span>
        )
      })}
    </span>
  )
}

/* ───────── Scroll-scrubbed word reveal ───────── */
export function ScrubText({ text, className = '' }: { text: string; className?: string }) {
  const { lite } = usePerf()
  if (lite) return <p className={className}>{text}</p>
  return <ScrubTextFull text={text} className={className} />
}
function ScrubTextFull({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}
function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <m.span style={{ opacity }} className="me-[0.25em] inline-block">
      {children}
    </m.span>
  )
}

/* ───────── Fade/slide in view ───────── */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </m.div>
  )
}

/* ───────── Counter ───────── */
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease, onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref} dir="ltr" className="inline-block">
      {v}
      {suffix}
    </span>
  )
}

/* ───────── Velocity-reactive marquee (always LTR so the loop works in RTL pages) ───────── */
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const { lite } = usePerf()
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 300 })
  const skew = useTransform(smooth, [-3000, 3000], [-10, 10])
  const row = [...items, ...items]
  return (
    <m.div dir="ltr" style={{ skewX: lite ? 0 : skew }} className={`overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max gap-8 whitespace-nowrap sm:gap-10">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 sm:gap-10">
            {t}
            <span className="text-acid">✦</span>
          </span>
        ))}
      </div>
    </m.div>
  )
}
