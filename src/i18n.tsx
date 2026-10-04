import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'ar' | 'tr' | 'so'
export const LANGS: { code: Lang; label: string; native: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'EN', native: 'English', dir: 'ltr' },
  { code: 'ar', label: 'ع', native: 'العربية', dir: 'rtl' },
  { code: 'tr', label: 'TR', native: 'Türkçe', dir: 'ltr' },
  { code: 'so', label: 'SO', native: 'Soomaali', dir: 'ltr' },
]

const en = {
  meta: {
    title: 'Ali Mahmoud Ali — Full-Stack & AI Developer',
    description: 'Portfolio of Ali Mahmoud Ali — full-stack developer and AI integrator based in Konya, Türkiye.',
  },
  name: 'Ali Mahmoud Ali',
  word: 'Ali',
  preloader: 'Portfolio',
  nav: { about: 'About', skills: 'Skills', work: 'Work', journey: 'Journey', contact: 'Contact', talk: 'Let’s talk', menu: 'Menu', close: 'Close' },
  hero: {
    available: 'Open for new projects',
    l1: 'Hi, I’m Ali.',
    l2: 'I build websites',
    l3: '& smart apps.',
    sub: 'Full-stack developer from Konya, Türkiye. I turn ideas into fast, easy-to-use products — with a little AI magic.',
    cta1: 'See my work',
    cta2: 'Contact me',
    ring: 'Full-stack · AI integrator · Web craftsman · Open for projects ·',
  },
  about: {
    eyebrow: '( 01 ) About',
    text: "I'm a passionate full-stack developer and AI enthusiast with a Computer Engineering degree and 3+ years of hands-on experience. I blend cutting-edge technology with thoughtful design to ship web applications that feel effortless, fast, and alive.",
    stats: ['Years experience', 'Technologies', 'Live applications', 'Projects shipped'],
    basedIn: 'Based in',
    location: 'Konya, Türkiye',
    languages: 'Languages',
    languagesList: 'English · Arabic · Somali · Turkish',
    interests: 'Interests',
    interestList: ['AI & Machine Learning', '3D Development', 'Open Source', 'Tech Innovation'],
  },
  skills: {
    eyebrow: '( 02 ) Skills & Expertise',
    a: 'Tools I use to bring ',
    b: 'ideas',
    c: ' to life.',
    groups: ['Programming', 'Frontend', 'Backend', 'Mobile & AI', 'Tools'],
  },
  work: {
    eyebrow: '( 03 ) Selected work',
    a: 'AI-powered products, ',
    b: 'built to be used.',
    featured: '★ Featured',
    live: 'Live demo ↗',
    code: 'Source code',
    items: [
      { subtitle: 'AI Nutrition Tracker', description: 'Advanced AI food recognition using Google Gemini 2.5 Flash for image analysis, with full nutrition tracking, an intelligent goal system (achievements, streaks, recommendations) and a real-time analytics dashboard.' },
      { subtitle: 'Language Learning', description: 'A platform supporting 20+ languages with AI personalization, real-time pronunciation feedback, interactive AI conversation partners, gamification and progress tracking.' },
      { subtitle: 'Fitness AI', description: 'AI-powered fitness and wellness platform with intelligent workout personalization, real-time analytics and rich data visualization.' },
      { subtitle: 'Child AI Chat', description: 'A child-friendly AI chat interface with privacy-focused design and age-appropriate explanations for curious young minds.' },
    ],
  },
  journey: {
    eyebrow: '( 04 ) Experience & Education',
    a: 'The ',
    b: 'journey',
    c: ' so far.',
    items: [
      { period: '2023 — Now', title: 'Full-Stack Developer', place: 'Freelance', text: 'Building modern web applications with React, Next.js and TypeScript. Specialising in AI integration and mobile-first responsive design.', points: ['10+ successful projects', 'AI / ML integration expertise', 'Mobile-first responsive design'] },
      { period: '2019 — 2023', title: 'B.Sc. Computer Engineering', place: 'University', text: 'Bachelor’s degree focused on software development and artificial intelligence.', points: ['Software development', 'AI / ML fundamentals', 'System design'] },
    ],
  },
  contact: {
    eyebrow: '( 05 ) Contact',
    l1: 'Let’s build',
    l2: 'something great.',
    copy: 'Copy email',
    copied: 'Copied ✓',
    subject: 'Project inquiry',
    social: ['GitHub', 'LinkedIn', 'Email', 'WhatsApp'],
    wa: 'Chat on WhatsApp',
    waMsg: 'Hi Ali, I saw your portfolio and I’d like to talk about a project.',
    marquee: ['Say hello', 'Open for projects', 'Konya · Türkiye'],
    top: 'Back to top ↑',
  },
}
type Dict = typeof en

const ar: Dict = {
  meta: {
    title: 'علي محمود علي — مطوّر ويب متكامل وذكاء اصطناعي',
    description: 'الموقع الشخصي لعلي محمود علي — مطوّر ويب متكامل ومُدمج حلول الذكاء الاصطناعي، مقيم في قونيا، تركيا.',
  },
  name: 'علي محمود علي',
  word: 'علي',
  preloader: 'الموقع الشخصي',
  nav: { about: 'نبذة', skills: 'المهارات', work: 'أعمالي', journey: 'المسيرة', contact: 'تواصل', talk: 'لنتحدث', menu: 'القائمة', close: 'إغلاق' },
  hero: {
    available: 'متاح لمشاريع جديدة',
    l1: 'أهلاً، أنا علي.',
    l2: 'أبني مواقع',
    l3: 'وتطبيقات ذكية.',
    sub: 'مطوّر ويب متكامل من قونيا، تركيا. أحوّل الأفكار إلى منتجات سريعة وسهلة الاستخدام — بلمسة من الذكاء الاصطناعي.',
    cta1: 'شاهد أعمالي',
    cta2: 'تواصل معي',
    ring: 'مطوّر متكامل · دمج الذكاء الاصطناعي · صانع مواقع · متاح للمشاريع ·',
  },
  about: {
    eyebrow: '( 01 ) نبذة',
    text: 'أنا مطوّر ويب متكامل شغوف بالذكاء الاصطناعي، حاصل على بكالوريوس هندسة الحاسوب وخبرة عملية تزيد على 3 سنوات. أجمع بين أحدث التقنيات والتصميم المدروس لأقدّم تطبيقات ويب سريعة وسلسة وحيّة.',
    stats: ['سنوات الخبرة', 'تقنية', 'تطبيق منشور', 'مشروع منجز'],
    basedIn: 'مقيم في',
    location: 'قونيا، تركيا',
    languages: 'اللغات',
    languagesList: 'الإنجليزية · العربية · الصومالية · التركية',
    interests: 'الاهتمامات',
    interestList: ['الذكاء الاصطناعي وتعلّم الآلة', 'التطوير ثلاثي الأبعاد', 'المصادر المفتوحة', 'الابتكار التقني'],
  },
  skills: {
    eyebrow: '( 02 ) المهارات والخبرات',
    a: 'الأدوات التي أحوّل بها ',
    b: 'الأفكار',
    c: ' إلى واقع.',
    groups: ['لغات البرمجة', 'الواجهة الأمامية', 'الخلفية', 'الجوال والذكاء الاصطناعي', 'الأدوات'],
  },
  work: {
    eyebrow: '( 03 ) أعمال مختارة',
    a: 'منتجات بالذكاء الاصطناعي، ',
    b: 'صُنعت لتُستخدم.',
    featured: '★ مميّز',
    live: 'عرض مباشر ↗',
    code: 'الشيفرة المصدرية',
    items: [
      { subtitle: 'متتبّع التغذية الذكي', description: 'تعرّف متقدّم على الطعام بالذكاء الاصطناعي عبر Google Gemini 2.5 Flash، مع تتبّع كامل للتغذية ونظام أهداف ذكي (إنجازات وسلاسل التزام وتوصيات) ولوحة تحليلات لحظية.' },
      { subtitle: 'تعلّم اللغات', description: 'منصة تدعم أكثر من 20 لغة مع تخصيص بالذكاء الاصطناعي، وتقييم فوري للنطق، وشركاء محادثة ذكيون، وعناصر تحفيز وتتبّع للتقدّم.' },
      { subtitle: 'اللياقة بالذكاء الاصطناعي', description: 'منصة لياقة وصحة مدعومة بالذكاء الاصطناعي، تخصّص التمارين بذكاء وتقدّم تحليلات لحظية ورسوماً بيانية غنية.' },
      { subtitle: 'دردشة ذكية للأطفال', description: 'واجهة دردشة بالذكاء الاصطناعي صديقة للأطفال، بتصميم يحمي الخصوصية وشروحات مناسبة للعمر لعقول صغيرة فضولية.' },
    ],
  },
  journey: {
    eyebrow: '( 04 ) الخبرة والتعليم',
    a: '',
    b: 'المسيرة',
    c: ' حتى الآن.',
    items: [
      { period: '2023 — الآن', title: 'مطوّر ويب متكامل', place: 'عمل حر', text: 'أبني تطبيقات ويب حديثة باستخدام React وNext.js وTypeScript، مع تخصّص في دمج الذكاء الاصطناعي والتصميم المتجاوب للجوال أولاً.', points: ['أكثر من 10 مشاريع ناجحة', 'خبرة في دمج الذكاء الاصطناعي', 'تصميم متجاوب للجوال أولاً'] },
      { period: '2019 — 2023', title: 'بكالوريوس هندسة الحاسوب', place: 'الجامعة', text: 'درجة البكالوريوس مع تركيز على تطوير البرمجيات والذكاء الاصطناعي.', points: ['تطوير البرمجيات', 'أساسيات الذكاء الاصطناعي', 'تصميم الأنظمة'] },
    ],
  },
  contact: {
    eyebrow: '( 05 ) تواصل',
    l1: 'لنبنِ معاً',
    l2: 'شيئاً رائعاً.',
    copy: 'نسخ البريد',
    copied: 'تم النسخ ✓',
    subject: 'استفسار عن مشروع',
    social: ['GitHub', 'LinkedIn', 'البريد', 'واتساب'],
    wa: 'تحدث معي عبر واتساب',
    waMsg: 'مرحباً علي، شاهدت موقعك الشخصي وأود التحدث معك عن مشروع.',
    marquee: ['قل مرحباً', 'متاح للمشاريع', 'قونيا · تركيا'],
    top: 'العودة للأعلى ↑',
  },
}

const tr: Dict = {
  meta: {
    title: 'Ali Mahmoud Ali — Full-Stack & Yapay Zekâ Geliştirici',
    description: 'Ali Mahmoud Ali’nin portfolyosu — Konya, Türkiye merkezli full-stack geliştirici ve yapay zekâ entegratörü.',
  },
  name: 'Ali Mahmoud Ali',
  word: 'Ali',
  preloader: 'Portfolyo',
  nav: { about: 'Hakkımda', skills: 'Yetenekler', work: 'Projeler', journey: 'Yolculuk', contact: 'İletişim', talk: 'Konuşalım', menu: 'Menü', close: 'Kapat' },
  hero: {
    available: 'Yeni projelere açığım',
    l1: 'Merhaba, ben Ali.',
    l2: 'Web siteleri ve',
    l3: 'akıllı uygulamalar yaparım.',
    sub: 'Konya’dan full-stack geliştirici. Fikirleri hızlı ve kullanımı kolay ürünlere dönüştürüyorum — biraz yapay zekâ büyüsüyle.',
    cta1: 'Çalışmalarım',
    cta2: 'İletişime geç',
    ring: 'Full-stack · Yapay zekâ entegrasyonu · Web ustası · Projelere açık ·',
  },
  about: {
    eyebrow: '( 01 ) Hakkımda',
    text: 'Bilgisayar Mühendisliği diploması ve 3+ yıllık pratik deneyime sahip, yapay zekâ meraklısı bir full-stack geliştiriciyim. En yeni teknolojileri özenli tasarımla birleştirerek zahmetsiz, hızlı ve canlı hissettiren web uygulamaları geliştiriyorum.',
    stats: ['Yıllık deneyim', 'Teknoloji', 'Yayında uygulama', 'Tamamlanan proje'],
    basedIn: 'Konum',
    location: 'Konya, Türkiye',
    languages: 'Diller',
    languagesList: 'İngilizce · Arapça · Somalice · Türkçe',
    interests: 'İlgi alanları',
    interestList: ['Yapay Zekâ ve Makine Öğrenmesi', '3D Geliştirme', 'Açık Kaynak', 'Teknoloji İnovasyonu'],
  },
  skills: {
    eyebrow: '( 02 ) Yetenekler',
    a: 'Fikirleri ',
    b: 'hayata',
    c: ' geçirmek için kullandığım araçlar.',
    groups: ['Programlama', 'Ön yüz', 'Arka yüz', 'Mobil ve Yapay Zekâ', 'Araçlar'],
  },
  work: {
    eyebrow: '( 03 ) Seçilmiş işler',
    a: 'Yapay zekâ destekli ürünler, ',
    b: 'kullanılmak için üretildi.',
    featured: '★ Öne çıkan',
    live: 'Canlı demo ↗',
    code: 'Kaynak kod',
    items: [
      { subtitle: 'Yapay Zekâlı Beslenme Takibi', description: 'Google Gemini 2.5 Flash ile görselden yemek tanıma, tam beslenme takibi, akıllı hedef sistemi (başarımlar, seriler, öneriler) ve gerçek zamanlı analiz paneli.' },
      { subtitle: 'Dil Öğrenme', description: '20+ dili destekleyen; yapay zekâ kişiselleştirmesi, anlık telaffuz geri bildirimi, etkileşimli yapay zekâ sohbet partnerleri, oyunlaştırma ve ilerleme takibi sunan platform.' },
      { subtitle: 'Yapay Zekâlı Fitness', description: 'Akıllı antrenman kişiselleştirmesi, gerçek zamanlı analizler ve zengin veri görselleştirmesi sunan yapay zekâ destekli fitness ve sağlık platformu.' },
      { subtitle: 'Çocuklar için Yapay Zekâ Sohbeti', description: 'Gizlilik odaklı tasarıma ve yaşa uygun açıklamalara sahip, meraklı küçük zihinler için çocuk dostu yapay zekâ sohbet arayüzü.' },
    ],
  },
  journey: {
    eyebrow: '( 04 ) Deneyim ve Eğitim',
    a: 'Şimdiye kadarki ',
    b: 'yolculuk',
    c: '.',
    items: [
      { period: '2023 — Şimdi', title: 'Full-Stack Geliştirici', place: 'Serbest', text: 'React, Next.js ve TypeScript ile modern web uygulamaları geliştiriyorum. Yapay zekâ entegrasyonu ve mobil öncelikli responsive tasarımda uzmanlaştım.', points: ['10+ başarılı proje', 'Yapay zekâ / ML entegrasyonu', 'Mobil öncelikli responsive tasarım'] },
      { period: '2019 — 2023', title: 'Bilgisayar Mühendisliği Lisans', place: 'Üniversite', text: 'Yazılım geliştirme ve yapay zekâ odaklı lisans eğitimi.', points: ['Yazılım geliştirme', 'Yapay zekâ / ML temelleri', 'Sistem tasarımı'] },
    ],
  },
  contact: {
    eyebrow: '( 05 ) İletişim',
    l1: 'Birlikte',
    l2: 'harika şeyler yapalım.',
    copy: 'E-postayı kopyala',
    copied: 'Kopyalandı ✓',
    subject: 'Proje talebi',
    social: ['GitHub', 'LinkedIn', 'E-posta', 'WhatsApp'],
    wa: 'WhatsApp’tan yaz',
    waMsg: 'Merhaba Ali, portfolyonu gördüm ve bir proje hakkında konuşmak istiyorum.',
    marquee: ['Merhaba de', 'Projelere açığım', 'Konya · Türkiye'],
    top: 'Yukarı çık ↑',
  },
}

const so: Dict = {
  meta: {
    title: 'Ali Mahmoud Ali — Horumariye Full-Stack iyo AI',
    description: 'Boggga shakhsiga ah ee Ali Mahmoud Ali — horumariye full-stack ah oo isku xira AI, deggan Konya, Turkiga.',
  },
  name: 'Ali Mahmoud Ali',
  word: 'Ali',
  preloader: 'Boggga Shaqada',
  nav: { about: 'Ku saabsan', skills: 'Xirfado', work: 'Shaqooyin', journey: 'Safarka', contact: 'La xiriir', talk: 'Aan hadalno', menu: 'Menu', close: 'Xir' },
  hero: {
    available: 'Diyaar u ah mashaariic cusub',
    l1: 'Salaan, waxaan ahay Ali.',
    l2: 'Waxaan dhisaa mareego',
    l3: 'iyo apps caqli badan.',
    sub: 'Horumariye full-stack ah oo ka kala yimid Konya, Turkiga. Fikradaha waxaan u rogaa alaab dhaqso badan oo fudud in la isticmaalo — iyadoo AI lagu daray.',
    cta1: 'Arag shaqadayda',
    cta2: 'La xiriir',
    ring: 'Full-stack · Isku xirka AI · Farshaxanka web · Diyaar u ah mashaariic ·',
  },
  about: {
    eyebrow: '( 01 ) Ku saabsan',
    text: 'Waxaan ahay horumariye full-stack ah oo xiiseeya AI, haysta shahaado Injineerinka Kombiyuutarka iyo in ka badan 3 sano oo khibrad ah. Waxaan isku daraa tignoolajiyada ugu cusub iyo naqshad taxadar leh si aan u soo saaro codsiyo web ah oo fudud, degdeg ah, oo nool.',
    stats: ['Sano khibrad', 'Tignoolajiyo', 'Apps nool', 'Mashaariic la dhammeeyay'],
    basedIn: 'Deggan',
    location: 'Konya, Turkiga',
    languages: 'Luuqado',
    languagesList: 'Ingiriis · Carabi · Soomaali · Turki',
    interests: 'Xiisaha',
    interestList: ['AI iyo Barashada Mashiinka', 'Horumarinta 3D', 'Isha Furan', 'Hal-abuurka Tignoolajiyada'],
  },
  skills: {
    eyebrow: '( 02 ) Xirfado & Khibrad',
    a: 'Qalabka aan u isticmaalo inaan ',
    b: 'fikradaha',
    c: ' nolosha u soo celiyo.',
    groups: ['Barnaamijyo', 'Frontend', 'Backend', 'Mobile & AI', 'Qalab'],
  },
  work: {
    eyebrow: '( 03 ) Shaqooyin la doortay',
    a: 'Alaab AI ku shaqeysa, ',
    b: 'loo dhisay in la isticmaalo.',
    featured: '★ Gaar ah',
    live: 'Tijaabo toos ah ↗',
    code: 'Koodhka isha',
    items: [
      { subtitle: 'La-socodka Nafaqada ee AI', description: 'Aqoonsiga cuntada ee AI oo adeegsada Google Gemini 2.5 Flash, la socodka nafaqada oo dhammaystiran, nidaam yoolal caqli leh (guulo, xariijimo, talooyin) iyo dashboard falanqeyn waqti-dhab ah.' },
      { subtitle: 'Barashada Luuqadaha', description: 'Madal taageerta in ka badan 20 luuqadood oo leh shakhsiyeyn AI, jawaab-celin degdeg ah oo ku saabsan dhawaaqa, saaxiibbo wada-hadal AI, ciyaar-ka-dhigis iyo la-socodka horumarka.' },
      { subtitle: 'Fitnis AI', description: 'Madal fitnis iyo caafimaad oo AI ku shaqeysa, leh shakhsiyeynta layliyada, falanqeyn waqti-dhab ah iyo muuqaal xog oo hodan ah.' },
      { subtitle: 'Wada-hadal AI ee Carruurta', description: 'Interface wada-hadal AI ah oo ku habboon carruurta, leh naqshad ilaalisa asturnaanta iyo sharraxaad ku habboon da’da maskaxaha yaryar ee xiiseeya.' },
    ],
  },
  journey: {
    eyebrow: '( 04 ) Khibrad & Waxbarasho',
    a: 'Safarka ',
    b: 'ilaa hadda',
    c: '.',
    items: [
      { period: '2023 — Hadda', title: 'Horumariye Full-Stack', place: 'Madax-bannaan', text: 'Waxaan dhisaa codsiyo web casri ah anigoo adeegsanaya React, Next.js iyo TypeScript. Waxaan ku takhasusay isku xirka AI iyo naqshad mobile-first ah.', points: ['10+ mashruuc oo guul leh', 'Khibrad isku xirka AI / ML', 'Naqshad mobile-first ah'] },
      { period: '2019 — 2023', title: 'B.Sc. Injineerinka Kombiyuutarka', place: 'Jaamacad', text: 'Shahaado koowaad oo ku saleysan horumarinta software-ka iyo sirdoonka macmalka ah.', points: ['Horumarinta software-ka', 'Aasaaska AI / ML', 'Naqshadaynta nidaamka'] },
    ],
  },
  contact: {
    eyebrow: '( 05 ) La xiriir',
    l1: 'Aan wada dhisno',
    l2: 'wax weyn.',
    copy: 'Koobi iimaylka',
    copied: 'La koobiyeeyay ✓',
    subject: 'Codsi mashruuc',
    social: ['GitHub', 'LinkedIn', 'Iimayl', 'WhatsApp'],
    wa: 'Igu soo qor WhatsApp',
    waMsg: 'Salaan Ali, boggaaga ayaan arkay waxaanan jeclaan lahaa inaan kula hadlo mashruuc.',
    marquee: ['Salaan', 'Diyaar u ah mashaariic', 'Konya · Turkiga'],
    top: 'Kor u noqo ↑',
  },
}

const dicts: Record<Lang, Dict> = { en, ar, tr, so }

/** Pick the best supported language: saved choice first, then the device's preferred-language list. */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved && saved in dicts) return saved
  } catch {}
  const prefs = typeof navigator !== 'undefined' ? [...(navigator.languages ?? []), navigator.language] : []
  for (const p of prefs) {
    const base = (p || '').toLowerCase().split('-')[0]
    if (base in dicts) return base as Lang
  }
  return 'en'
}

type Ctx = { lang: Lang; t: Dict; dir: 'ltr' | 'rtl'; setLang: (l: Lang) => void; auto: boolean }
const I18n = createContext<Ctx>({ lang: 'en', t: en, dir: 'ltr', setLang: () => {}, auto: true })
export const useI18n = () => useContext(I18n)

export function LangProvider({ children }: { children: ReactNode }) {
  // Server + first client render use English (hydration-safe); the device language is applied right after mount.
  const [lang, setLangState] = useState<Lang>('en')
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    setLangState(detectLang())
    try {
      setAuto(!localStorage.getItem('lang'))
    } catch {}
  }, [])

  const dir = LANGS.find((l) => l.code === lang)!.dir
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = dir
    document.title = dicts[lang].meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', dicts[lang].meta.description)
  }, [lang, dir])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    setAuto(false)
    try {
      localStorage.setItem('lang', l)
    } catch {}
  }, [])

  const value = useMemo(() => ({ lang, t: dicts[lang], dir, setLang, auto }), [lang, dir, setLang, auto])
  return <I18n.Provider value={value}>{children}</I18n.Provider>
}
