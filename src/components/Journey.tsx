import { m, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { useI18n } from '../i18n'
import { ease, Reveal } from './fx'

export function Journey() {
  const { t, dir } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] })
  const h = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const slide = dir === 'rtl' ? -40 : 40
  return (
    <section id="journey" className="section-pad relative py-16 sm:py-24 lg:py-40">
      <Reveal>
        <p className="eyebrow mb-5 sm:mb-6">{t.journey.eyebrow}</p>
        <h2 className="mb-12 font-serif text-[clamp(2.1rem,6vw,6rem)] leading-[1] sm:mb-20">
          {t.journey.a}
          <span className="italic text-acid">{t.journey.b}</span>
          {t.journey.c}
        </h2>
      </Reveal>

      <div ref={ref} className="relative ps-7 sm:ps-16">
        <div className="absolute bottom-0 start-0 top-0 w-px bg-white/10" />
        <m.div className="absolute start-0 top-0 w-px origin-top bg-acid" style={{ scaleY: h, height: '100%' }} />

        {t.journey.items.map((e, i) => (
          <m.article
            key={i}
            className="relative mb-14 last:mb-0 sm:mb-20"
            initial={{ opacity: 0, x: slide }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease, delay: i * 0.05 }}
          >
            <span className="absolute -start-[35px] top-2 h-4 w-4 rounded-full border-2 border-acid bg-ink sm:-start-[73px] sm:top-3" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-acid">{e.period}</p>
            <h3 className="mt-3 font-serif text-3xl sm:text-5xl lg:text-6xl">{e.title}</h3>
            <p className="mt-1 font-serif text-xl italic text-mute sm:text-2xl">{e.place}</p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/75 sm:mt-6 sm:text-lg">{e.text}</p>
            <ul className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              {e.points.map((p) => (
                <li key={p} className="rounded-full border border-white/15 px-3 py-1.5 text-sm sm:px-4 sm:py-2">
                  ✓ {p}
                </li>
              ))}
            </ul>
          </m.article>
        ))}
      </div>
    </section>
  )
}
