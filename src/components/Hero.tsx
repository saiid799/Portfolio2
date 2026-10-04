import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'
import { techMarquee } from '../data'
import { useI18n } from '../i18n'
import { usePerf } from '../perf'
import { ease, Magnetic, Marquee, SplitLetters } from './fx'
import { Portrait } from './Portrait'

/**
 * One-screen hero (100svh). Phones/tablets: portrait on top, copy below. Desktop: copy start,
 * portrait end. Headline size scales with viewport width AND height, and shrinks for longer
 * translations so every language fits without scrolling.
 */
export function Hero({ start }: { start: boolean }) {
  const { t } = useI18n()
  const { lite } = usePerf()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const bx = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 })
  const by = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 })
  const nbx = useTransform(bx, (v) => -v)
  const nby = useTransform(by, (v) => -v)
  useEffect(() => {
    if (lite || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const m = (e: PointerEvent) => {
      bx.set((e.clientX / window.innerWidth - 0.5) * 120)
      by.set((e.clientY / window.innerHeight - 0.5) * 120)
    }
    window.addEventListener('pointermove', m)
    return () => window.removeEventListener('pointermove', m)
  }, [bx, by, lite])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: start ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, ease, delay },
  })

  // longer translations → slightly smaller headline (English = 1)
  const chars = t.hero.l1.length + t.hero.l2.length + t.hero.l3.length
  const factor = Math.min(1, 46 / chars)

  return (
    <section id="top" ref={ref} className="relative grid h-svh min-h-[600px] grid-rows-[1fr_auto] overflow-hidden">
      <motion.div
        aria-hidden
        className="blob blob-violet pointer-events-none absolute left-[6%] top-[15%] h-[40vmin] w-[40vmin]"
        style={{ x: bx, y: by }}
      />
      <motion.div
        aria-hidden
        className="blob blob-acid pointer-events-none absolute bottom-[10%] right-[8%] h-[32vmin] w-[32vmin]"
        style={{ x: nbx, y: nby }}
      />
      <div aria-hidden className="spotlight pointer-events-none absolute inset-0" />

      <Portrait start={start} />

      <motion.div
        style={{ y, opacity: fade, ['--hf' as string]: factor }}
        className="section-pad relative z-10 flex flex-col justify-end pb-[3svh] pt-20 lg:justify-center lg:pb-0"
      >
        <motion.p {...fadeUp(0.2)} className="eyebrow mb-[1.5svh] flex items-center gap-3 lg:mb-[2svh]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
          </span>
          {t.hero.available}
        </motion.p>

        <h1 className="font-serif leading-[0.98] tracking-tight text-[calc(clamp(2rem,min(11vw,9.5svh),8.5rem)*var(--hf))] sm:text-[calc(clamp(2rem,min(9vw,9.5svh),8.5rem)*var(--hf))] lg:max-w-[54%] lg:text-[calc(clamp(2rem,min(7.4vw,13svh),8.5rem)*var(--hf))]">
          <span className="block text-mute italic">
            <SplitLetters text={t.hero.l1} start={start} delay={0.1} />
          </span>
          <span className="block">
            <SplitLetters text={t.hero.l2} start={start} delay={0.45} />
          </span>
          <span className="block">
            <SplitLetters text={t.hero.l3} start={start} delay={0.8} className="text-acid italic" />
          </span>
        </h1>

        <motion.p
          {...fadeUp(1.2)}
          className="mt-[2svh] max-w-[38ch] text-[clamp(0.95rem,min(1.6vw,2.4svh),1.3rem)] leading-relaxed text-paper/70 max-lg:[@media(max-height:700px)]:hidden lg:mt-[2.5svh]"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div {...fadeUp(1.35)} className="mt-[2.5svh] flex flex-wrap gap-3 sm:gap-4 lg:mt-[3svh]">
          <Magnetic>
            <a
              href="#work"
              data-cursor="View"
              className="inline-block rounded-full bg-acid px-6 py-3 font-medium text-black no-underline sm:px-8 sm:py-4"
            >
              {t.hero.cta1} ↓
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="inline-block rounded-full border border-white/25 px-6 py-3 font-medium text-paper no-underline transition hover:border-acid hover:text-acid sm:px-8 sm:py-4"
            >
              {t.hero.cta2}
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <Marquee
        className="relative z-10 border-y border-white/10 py-[1.4svh] font-serif text-[clamp(1.3rem,4.4svh,3.5rem)] italic text-paper/70"
        items={techMarquee}
      />
    </section>
  )
}
