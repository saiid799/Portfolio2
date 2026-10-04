import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { profile } from '../data'
import { useI18n } from '../i18n'
import { ease, Magnetic, Marquee, Reveal } from './fx'
import { WhatsAppIcon } from './WhatsApp'

export function Contact() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  const wa = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(t.contact.waMsg)}`
  const links = [profile.github, profile.linkedin, `mailto:${profile.email}`, wa]

  return (
    <section id="contact" className="relative overflow-hidden pt-16 sm:pt-24 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[60vw] w-[60vw] -translate-x-1/2 rounded-full bg-acid/10 blur-[120px]" />
      <div className="section-pad relative">
        <Reveal>
          <p className="eyebrow mb-5 sm:mb-6">{t.contact.eyebrow}</p>
        </Reveal>
        <h2 className="font-serif text-[clamp(2.8rem,12vw,12rem)] leading-[0.95]">
          <motion.span
            className="block"
            initial={{ y: '40%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
          >
            {t.contact.l1}
          </motion.span>
          <motion.span
            className="block italic text-acid"
            initial={{ y: '40%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: 0.12 }}
          >
            {t.contact.l2}
          </motion.span>
        </h2>

        <Reveal className="mt-10 flex flex-wrap items-center gap-4 sm:mt-14 sm:gap-6">
          <Magnetic>
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent(t.contact.subject)}`}
              data-cursor="Email"
              dir="ltr"
              className="inline-block max-w-full break-all rounded-full bg-acid px-6 py-4 text-base font-medium text-black no-underline sm:px-8 sm:py-5 sm:text-lg"
            >
              {profile.email}
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Chat"
              className="inline-flex items-center gap-3 rounded-full border border-[#25D366]/60 bg-[#25D366]/10 px-6 py-4 text-base font-medium text-[#25D366] no-underline transition hover:bg-[#25D366] hover:text-black sm:px-8 sm:py-5 sm:text-lg"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.contact.wa}
            </a>
          </Magnetic>
          <button
            onClick={copy}
            className="relative h-12 min-w-36 rounded-full border border-white/25 px-6 font-mono text-xs uppercase tracking-[0.18em] transition hover:border-acid hover:text-acid sm:h-14"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={String(copied)}
                className="block"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? t.contact.copied : t.contact.copy}
              </motion.span>
            </AnimatePresence>
          </button>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:mt-24 lg:grid-cols-4">
          {links.map((h, i) => (
            <a
              key={h}
              href={h}
              target={h.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2 bg-ink p-5 text-paper no-underline transition-colors hover:bg-acid hover:text-black sm:p-8"
            >
              <span className="font-serif text-xl sm:text-3xl">{t.contact.social[i]}</span>
              <span className="text-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 sm:text-2xl">↗</span>
            </a>
          ))}
        </div>
      </div>

      <Marquee
        className="mt-16 border-t border-white/10 py-5 font-serif text-4xl italic text-paper/20 sm:mt-24 sm:py-6 sm:text-8xl"
        items={[...t.contact.marquee, profile.phone]}
      />
      <footer className="section-pad flex flex-wrap justify-between gap-4 border-t border-white/10 py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-mute sm:py-8 sm:text-xs">
        <span>© {new Date().getFullYear()} {t.name}</span>
        <a href="#top" className="text-mute no-underline hover:text-acid">{t.contact.top}</a>
      </footer>
    </section>
  )
}
