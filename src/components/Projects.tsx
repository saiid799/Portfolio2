import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { usePerf } from '../perf'
import { projects } from '../data'
import { useI18n } from '../i18n'
import { Reveal } from './fx'

type P = (typeof projects)[number]

/* ───────── Built-in animated visual per project ───────── */
function Visual({ p }: { p: P }) {
  const { lite } = usePerf()
  const box = useRef<HTMLDivElement>(null)
  // infinite loops only run while the card is on screen (and never in lite mode)
  const onScreen = useInView(box, { margin: '100px' })
  const run = onScreen && !lite
  const c = `hsl(${p.hue} 90% 62%)`
  const soft = `hsl(${p.hue} 90% 62% / 0.18)`
  const loop = { repeat: run ? Infinity : 0, ease: 'easeInOut' as const }

  return (
    <div ref={box} dir="ltr" className="relative flex h-full min-h-[240px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/30 sm:min-h-[300px]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(circle at 50% 50%, #000, transparent 70%)',
        }}
      />
      <div aria-hidden className="absolute h-full w-full rounded-full" style={{ background: `radial-gradient(circle, ${soft}, transparent 62%)` }} />

      {p.kind === 'ring' && (
        <div className="relative flex flex-col items-center gap-5">
          <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90 sm:h-44 sm:w-44">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="9" />
            <motion.circle
              cx="60" cy="60" r="50" fill="none" stroke={c} strokeWidth="9" strokeLinecap="round"
              strokeDasharray="314"
              initial={{ strokeDashoffset: 314 }}
              whileInView={{ strokeDashoffset: 314 * 0.28 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute top-[2.6rem] text-center sm:top-[3.3rem]">
            <div className="font-serif text-4xl sm:text-5xl">1,840</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-mute">kcal</div>
          </div>
          <div className="flex gap-2">
            {['Protein', 'Carbs', 'Fat'].map((m, i) => (
              <motion.span
                key={m}
                className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
                animate={run ? { y: [0, -5, 0] } : { y: 0 }}
                transition={{ duration: 3, delay: i * 0.3, ...loop }}
              >
                {m}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {p.kind === 'wave' && (
        <div className="relative flex flex-col items-center gap-6">
          <div className="flex h-28 items-center gap-1 sm:h-32 sm:gap-1.5">
            {Array.from({ length: 22 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-1 rounded-full sm:w-1.5"
                style={{ background: c, height: 24 }}
                animate={run ? { scaleY: [0.3, 1 + ((i * 7) % 5) / 4, 0.4] } : { scaleY: 0.3 + ((i * 7) % 5) / 6 }}
                transition={{ duration: 1.4 + (i % 4) * 0.2, delay: i * 0.07, ...loop }}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2 px-3">
            {['English', 'Español', '日本語', 'العربية', 'Türkçe'].map((l, i) => (
              <motion.span
                key={l}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs"
                animate={run ? { y: [0, -4, 0] } : { y: 0 }}
                transition={{ duration: 3, delay: i * 0.25, ...loop }}
              >
                {l}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {p.kind === 'bars' && (
        <div className="relative flex flex-col items-center gap-4">
          <div className="flex h-32 items-end gap-2 sm:h-40 sm:gap-3">
            {[40, 62, 48, 80, 66, 94, 76].map((h, i) => (
              <motion.span
                key={i}
                className="w-5 origin-bottom rounded-t-md sm:w-6"
                style={{ height: `${h}%`, background: `linear-gradient(to top, ${soft}, ${c})` }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
          <div className="flex gap-2 font-mono text-[10px] uppercase tracking-widest text-mute sm:gap-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="w-5 text-center sm:w-6">{d}</span>
            ))}
          </div>
        </div>
      )}

      {p.kind === 'chat' && (
        <div className="relative flex w-[82%] max-w-xs flex-col gap-3">
          {[
            { me: true, t: 'Why is the sky blue?' },
            { me: false, t: 'Sunlight bounces off tiny air bits — blue bounces the most! 🌤️' },
            { me: true, t: 'Cool! Tell me more' },
          ].map((m, i) => (
            <motion.div
              key={i}
              className={`rounded-2xl px-4 py-2.5 text-sm ${m.me ? 'self-end rounded-br-sm text-black' : 'self-start rounded-bl-sm border border-white/15 bg-white/5'}`}
              style={m.me ? { background: c } : undefined}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {m.t}
            </motion.div>
          ))}
        </div>
      )}

      <span aria-hidden className="pointer-events-none absolute -bottom-10 -right-2 font-serif text-[10rem] italic leading-none opacity-[0.08] sm:text-[12rem]">
        {p.title[0]}
      </span>
    </div>
  )
}

function useIsLg() {
  const { lite } = usePerf()
  const [lg, setLg] = useState(false)
  useEffect(() => {
    if (lite) {
      setLg(false)
      return
    }
    const mq = window.matchMedia('(min-width: 1024px) and (min-height: 640px)')
    const on = () => setLg(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [lite])
  return lg
}

function Card({ p, i, total }: { p: P; i: number; total: number }) {
  const { t } = useI18n()
  const lg = useIsLg()
  const wrap = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const info = t.work.items[i]

  // stacking (desktop only): shrink + dim as the next card slides over
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end start'] })
  const last = i === total - 1
  const scale = useTransform(scrollYProgress, [0, 1], [1, lg && !last ? 0.92 : 1])
  const dim = useTransform(scrollYProgress, [0, 1], [0, lg && !last ? 0.55 : 0])

  // tilt + glare (mouse only)
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glare = useMotionTemplate`radial-gradient(500px circle at ${gx}% ${gy}%, rgba(255,255,255,0.1), transparent 55%)`

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = card.current!.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 5)
    rx.set(-(py - 0.5) * 5)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  const accent = `hsl(${p.hue} 90% 70%)`

  return (
    <div ref={wrap} className="mb-6 lg:sticky lg:mb-0" style={{ top: lg ? `${6 + i * 2.2}vh` : undefined, perspective: 1600 }}>
      <motion.div
        ref={card}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          scale,
          rotateX: rx,
          rotateY: ry,
          transformOrigin: 'top center',
          background: `linear-gradient(135deg, hsl(${p.hue} 55% 11%), #0b0b10 70%)`,
        }}
        className="relative grid overflow-hidden rounded-[1.5rem] border border-white/10 sm:rounded-[2rem] lg:mb-[10vh] lg:min-h-[68vh] lg:grid-cols-[1.05fr_1fr]"
      >
        <motion.div className="pointer-events-none absolute inset-0 z-20" style={{ background: glare }} />
        <motion.div className="pointer-events-none absolute inset-0 z-30 bg-black" style={{ opacity: dim }} />

        <span aria-hidden dir="ltr" className="outline-text pointer-events-none absolute end-6 top-2 z-0 hidden font-serif text-[9rem] italic leading-none opacity-50 lg:block">
          {String(i + 1).padStart(2, '0')}
        </span>

        <div className="relative z-10 flex flex-col justify-between p-5 sm:p-10 lg:p-12">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] sm:mb-6">
              <span style={{ color: accent }} dir="ltr">
                {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              {p.featured && <span className="rounded-full border border-white/20 px-3 py-1 text-paper/70">{t.work.featured}</span>}
            </div>
            <h3 className="font-serif text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.95]" dir="ltr" style={{ textAlign: 'start' }}>
              {p.title}
            </h3>
            <p className="mt-2 font-serif text-xl italic sm:text-2xl" style={{ color: accent }}>
              {info.subtitle}
            </p>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/75 sm:mt-6 sm:text-base">{info.description}</p>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6" dir="ltr">
              {p.stack.map((s) => (
                <span key={s} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] text-paper/70">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <a
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open"
              className="rounded-full px-6 py-3 text-sm font-medium text-black no-underline"
              style={{ background: accent }}
            >
              {t.work.live}
            </a>
            <a
              href={p.code}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-paper no-underline transition hover:border-acid hover:text-acid"
            >
              {t.work.code}
            </a>
          </div>
        </div>

        <div className="relative z-10 p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8">
          <Visual p={p} />
        </div>
      </motion.div>
    </div>
  )
}

export function Projects() {
  const { t } = useI18n()
  return (
    <section id="work" className="section-pad relative py-16 sm:py-24 lg:py-40">
      <Reveal>
        <p className="eyebrow mb-5 sm:mb-6">{t.work.eyebrow}</p>
        <h2 className="mb-12 max-w-4xl font-serif text-[clamp(2.1rem,6vw,6rem)] leading-[1] sm:mb-20">
          {t.work.a}
          <span className="italic text-acid">{t.work.b}</span>
        </h2>
      </Reveal>
      {projects.map((p, i) => (
        <Card key={p.title} p={p} i={i} total={projects.length} />
      ))}
    </section>
  )
}
