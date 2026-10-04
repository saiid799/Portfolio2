import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { useI18n } from '../i18n'
import { usePerf } from '../perf'
import { ease } from './fx'

// Arabic can't be spread along a circle (letters must stay joined), so RTL keeps a Latin ring.
const RING_LATIN = 'Full-stack · AI integrator · Web craftsman · Open for projects ·'

/**
 * Editorial portrait: the cut-out face sits on a solid accent disc so its dark tones pop
 * against the site palette. A rotating text ring echoes the marquee, and face / disc / word
 * drift at different depths with the pointer. In "lite" mode (weak devices) the ring stays still,
 * the parallax/float/glow are off and only a tiny fade-in plays.
 * Layout: centred above the copy on phones & tablets, anchored to the end side on desktop.
 */
export function Portrait({ start }: { start: boolean }) {
  const { t, dir } = useI18n()
  const { lite } = usePerf()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 90, damping: 20 })
  const sy = useSpring(py, { stiffness: 90, damping: 20 })

  useEffect(() => {
    if (lite || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 2)
      py.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [px, py, lite])

  const faceX = useTransform(sx, [-1, 1], [-14, 14])
  const faceY = useTransform(sy, [-1, 1], [-8, 8])
  const faceR = useTransform(sx, [-1, 1], [-3, 3])
  const discX = useTransform(sx, [-1, 1], [10, -10])
  const discY = useTransform(sy, [-1, 1], [6, -6])
  const wordX = useTransform(sx, [-1, 1], [30, -30])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[9svh] z-[1] mx-auto aspect-square w-[min(60vw,34svh)] md:w-[min(46vw,38svh)] lg:inset-x-auto lg:bottom-[11svh] lg:top-auto lg:mx-0 lg:w-[min(44vw,74svh)] lg:end-[3vw]"
    >
      {/* giant outlined word behind everything */}
      <motion.span
        className="outline-text absolute -left-[22%] top-[4%] hidden select-none font-serif text-[clamp(8rem,26vw,24rem)] italic leading-none sm:block"
        style={{ x: wordX }}
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 0.55 } : {}}
        transition={{ duration: 1.2, delay: 0.6 }}
      >
        {t.word}
      </motion.span>

      {/* accent disc + rotating text ring */}
      <motion.div
        className="absolute inset-[7%]"
        style={{ x: discX, y: discY }}
        initial={{ scale: lite ? 1 : 0, opacity: 0 }}
        animate={start ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: lite ? 0.5 : 1.1, ease, delay: lite ? 0 : 0.25 }}
      >
        <div className="disc-glow absolute inset-0 rounded-full bg-acid" />
        <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), transparent 50%)' }} />
        <svg viewBox="0 0 200 200" className="absolute -inset-[9%] h-[118%] w-[118%] overflow-visible">
          <defs>
            <path id="ring" d="M100 100 m-97 0 a97 97 0 1 1 194 0 a97 97 0 1 1 -194 0" />
          </defs>
          <g>
            {!lite && (
              <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="40s" repeatCount="indefinite" />
            )}
            <text fill="#f2efe9" fontSize="9.5" letterSpacing="3.2" fontFamily="JetBrains Mono, monospace" style={{ textTransform: 'uppercase' }}>
              <textPath href="#ring" textLength="600" lengthAdjust="spacing">{dir === 'rtl' ? RING_LATIN : t.hero.ring}</textPath>
            </text>
          </g>
        </svg>
      </motion.div>

      {/* the face (small transparent WebP, ~34 KB) — bottom-aligned inside the disc area */}
      <motion.div
        className="absolute inset-0"
        style={{ x: faceX, y: faceY, rotate: faceR }}
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ duration: lite ? 0.5 : 1.2, ease, delay: lite ? 0.1 : 0.55 }}
      >
        <div className="float-anim absolute inset-x-0 bottom-[3.1%] flex h-[93.2%] justify-center">
          <img
            src="/images/profile.webp"
            alt=""
            width={640}
            height={989}
            fetchPriority="high"
            decoding="async"
            className="face-shadow block h-full w-auto"
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  )
}
