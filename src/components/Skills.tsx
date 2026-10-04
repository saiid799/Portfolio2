import { m } from 'motion/react'
import { skills } from '../data'
import { useI18n } from '../i18n'
import { ease, Reveal } from './fx'

export function Skills() {
  const { t } = useI18n()
  return (
    <section id="skills" className="section-pad relative py-16 sm:py-24 lg:py-40">
      <Reveal>
        <p className="eyebrow mb-5 sm:mb-6">{t.skills.eyebrow}</p>
        <h2 className="mb-12 max-w-4xl font-serif text-[clamp(2.1rem,6vw,6rem)] leading-[1] sm:mb-20">
          {t.skills.a}
          <span className="italic text-acid">{t.skills.b}</span>
          {t.skills.c}
        </h2>
      </Reveal>

      <div className="border-t border-white/10">
        {skills.map((items, gi) => (
          <m.div
            key={gi}
            className="group grid gap-4 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.02] sm:gap-6 sm:py-8 md:grid-cols-[260px_1fr] md:items-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: gi * 0.05 } } }}
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-acid" dir="ltr">0{gi + 1}</span>
              <h3 className="font-serif text-3xl transition-transform duration-500 group-hover:translate-x-3 rtl:group-hover:-translate-x-3 sm:text-4xl">
                {t.skills.groups[gi]}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3" dir="ltr">
              {items.map((s) => (
                <m.span
                  key={s}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.9 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
                  }}
                  whileHover={{ y: -6, rotate: -2 }}
                  className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm transition-colors hover:border-acid hover:bg-acid hover:text-black sm:px-5 sm:py-2.5 sm:text-base"
                >
                  {s}
                </m.span>
              ))}
            </div>
          </m.div>
        ))}
      </div>
    </section>
  )
}
