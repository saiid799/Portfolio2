import { m } from 'motion/react'
import { profile } from '../data'
import { useI18n } from '../i18n'
import { Counter, ease, Reveal, ScrubText } from './fx'

export function About() {
  const { t } = useI18n()
  return (
    <section id="about" className="section-pad relative py-20 sm:py-32 lg:py-48">
      <Reveal>
        <p className="eyebrow mb-8 sm:mb-10">{t.about.eyebrow}</p>
      </Reveal>

      <ScrubText
        key={t.about.text}
        text={t.about.text}
        className="max-w-6xl font-serif text-[clamp(1.6rem,4.6vw,4.5rem)] leading-[1.12]"
      />

      <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:mt-24 lg:grid-cols-4">
        {profile.stats.map((s, i) => (
          <m.div
            key={i}
            className="group relative bg-ink p-5 transition-colors hover:bg-ink-2 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: i * 0.1 }}
          >
            <div className="font-serif text-6xl text-acid sm:text-7xl lg:text-8xl">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-mute sm:mt-3 sm:text-xs sm:tracking-[0.18em]">{t.about.stats[i]}</div>
          </m.div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 sm:mt-16 sm:gap-10 md:grid-cols-3">
        <Reveal>
          <p className="eyebrow mb-3">{t.about.basedIn}</p>
          <p className="text-xl sm:text-2xl">{t.about.location}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-3">{t.about.languages}</p>
          <p className="text-xl sm:text-2xl">{t.about.languagesList}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="eyebrow mb-3">{t.about.interests}</p>
          <div className="flex flex-wrap gap-2">
            {t.about.interestList.map((x) => (
              <span key={x} className="rounded-full border border-white/15 px-3 py-1 text-sm text-paper/80">
                {x}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
