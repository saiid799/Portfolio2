import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import { profile } from '../data'
import { useI18n } from '../i18n'
import { ease } from './fx'

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 2C6.5 2 2 6.5 2 12.04c0 1.77.46 3.5 1.34 5.02L2 22l5.07-1.33a10 10 0 0 0 4.97 1.31c5.54 0 10.04-4.5 10.04-10.04C22.08 6.5 17.58 2 12.04 2zm0 18.3a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.01.79.8-2.93-.2-.31a8.27 8.27 0 0 1-1.27-4.43c0-4.58 3.73-8.3 8.31-8.3 4.58 0 8.3 3.72 8.3 8.3s-3.72 8.22-8.4 8.22z" />
    </svg>
  )
}

/** Floating WhatsApp button — appears after the hero, shows a label on hover. */
export function WhatsAppFab({ show }: { show: boolean }) {
  const { t } = useI18n()
  const [past, setPast] = useState(false)
  useEffect(() => {
    const on = () => setPast(window.scrollY > window.innerHeight * 0.6)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const href = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(t.contact.waMsg)}`

  return (
    <AnimatePresence>
      {show && past && (
        <m.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact.wa}
          data-cursor="Chat"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="group fixed bottom-5 end-5 z-[75] flex items-center gap-3 rounded-full bg-[#25D366] p-4 text-black no-underline shadow-[0_10px_40px_rgba(37,211,102,0.45)] sm:bottom-8 sm:end-8"
        >
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
          <WhatsAppIcon className="h-6 w-6" />
          <span className="hidden max-w-0 overflow-hidden whitespace-nowrap font-medium transition-all duration-500 group-hover:max-w-[14rem] group-hover:pe-2 sm:inline">
            {t.contact.wa}
          </span>
        </m.a>
      )}
    </AnimatePresence>
  )
}
