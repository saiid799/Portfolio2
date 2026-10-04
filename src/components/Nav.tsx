import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { LANGS, useI18n } from '../i18n'
import { ease, Magnetic } from './fx'

/** Pill switcher with a sliding highlight. */
function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n()
  return (
    <div dir="ltr" className={`relative grid grid-cols-4 rounded-full border border-white/25 p-0.5 ${className}`} role="group" aria-label="Language">
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 w-[calc(25%-0.125rem)] rounded-full bg-acid transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${LANGS.findIndex((x) => x.code === lang) * 100}%)` }}
      />
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.native}
          aria-pressed={lang === l.code}
          lang={l.code}
          className={`relative z-10 min-w-9 rounded-full px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
            lang === l.code ? 'text-black' : 'text-white/80 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

export function Nav({ show }: { show: boolean }) {
  const { t } = useI18n()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [last, setLast] = useState(0)
  const [open, setOpen] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => {
    setHidden(y > last && y > 200)
    setLast(y)
  })

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const links: [string, string][] = [
    [t.nav.about, '#about'],
    [t.nav.skills, '#skills'],
    [t.nav.work, '#work'],
    [t.nav.journey, '#journey'],
    [t.nav.contact, '#contact'],
  ]

  return (
    <>
      <m.header
        className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between gap-3 px-4 py-3 mix-blend-difference sm:px-10 sm:py-4"
        initial={{ y: -80, opacity: 0 }}
        animate={show ? { y: hidden && !open ? -90 : 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease }}
      >
        <a href="#top" onClick={() => setOpen(false)} className="font-serif text-2xl italic text-white no-underline" dir="ltr">
          Ali<span className="text-acid">.</span>
        </a>

        <nav className="hidden gap-6 lg:flex xl:gap-8">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="group relative font-mono text-xs uppercase tracking-[0.18em] text-white no-underline">
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-acid transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch className="hidden sm:flex" />
          <Magnetic strength={0.25}>
            <a
              href="#contact"
              className="hidden rounded-full border border-white/60 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-white no-underline transition hover:bg-white hover:text-black md:inline-block"
            >
              {t.nav.talk}
            </a>
          </Magnetic>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.nav.close : t.nav.menu}
            aria-expanded={open}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/50 lg:hidden"
          >
            <span className={`absolute h-px w-4 bg-white transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1'}`} />
            <span className={`absolute h-px w-4 bg-white transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1'}`} />
          </button>
        </div>
      </m.header>

      {/* full-screen mobile / tablet menu */}
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[65] flex flex-col justify-between bg-ink px-5 pb-8 pt-24 lg:hidden"
            initial={{ clipPath: 'circle(0% at 90% 5%)' }}
            animate={{ clipPath: 'circle(150% at 90% 5%)' }}
            exit={{ clipPath: 'circle(0% at 90% 5%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col">
              {links.map(([l, h], i) => (
                <m.a
                  key={h}
                  href={h}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 border-b border-white/10 py-3 font-serif text-[clamp(2.4rem,11vw,4.5rem)] leading-tight text-paper no-underline"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.25 + i * 0.07 }}
                >
                  <span className="font-mono text-xs text-acid" dir="ltr">0{i + 1}</span>
                  {l}
                </m.a>
              ))}
            </nav>
            <div className="flex flex-col items-start gap-5">
              <LangSwitch className="sm:hidden" />
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="rounded-full bg-acid px-7 py-3.5 font-medium text-black no-underline"
              >
                {t.nav.talk}
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
