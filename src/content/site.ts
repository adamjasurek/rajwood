export const site = {
  name: 'RAJWOOD',
  region: 'Moravskoslezský kraj',
  seat: 'Hnojník',
  address: 'Hnojník 394',
  owner: 'Lukáš Rajnoha',
  ico: '000000000',
  credit: 'Vytvořil Adam Jašúrek',
  creditHref: 'https://adamjasurek.cz',
  email: '',
  warrantyYears: 'X',
  logo: {
    src: '/images/logo.png',
    headerSrc: '/images/svetle-logo.png',
    markSrc: '/images/svetle-znak.png',
    fallbackSrc: '/logo.svg',
  },
  phone: {
    display: '+420 736 235 553',
    tel: '+420736235553',
  },
  social: {
    instagram: '',
    facebook: '',
  },
  hero: {
    kicker: 'Po celém Moravskoslezském kraji',
    title: 'Dřevěné pergoly\nna míru',
    subtitle: 'Stavíme zakázkové pergoly, přístřešky a zahradní boudy.',
    cta: 'Prohlédnout práce',
    ctaHref: '/#realizace',
    image: {
      src: '/images/hero-pergola.png',
      alt: 'Zakázková dřevěná pergola',
    },
  },
  nav: [
    { href: '/#sluzby', label: 'Služby' },
    { href: '/#proc', label: 'Proč my' },
    { href: '/#realizace', label: 'Realizace' },
    { href: '/#kontakt', label: 'Kontakt' },
  ],
  services: {
    id: 'sluzby',
    kicker: 'Co děláme',
    title: 'Dřevostavby všeho druhu',
    items: [
      {
        name: 'Přístřešky',
        text: 'Na auto, na dřevo, na posezení. Konstrukce podle místa a toho, co má stavba unést.',
      },
      {
        name: 'Pergoly',
        text: 'Otevřené i se střechou. Na terasu, k domu, nebo volně do zahrady.',
      },
      {
        name: 'Boudy',
        text: 'Nářaďovny a úložné stavby. Jednoduché, suché, navržené tak, aby vydržely.',
      },
    ],
  },
  values: {
    id: 'proc',
    kicker: 'Proč RAJWOOD',
    title: 'Stojíme si za svou prací.',
    items: [
      {
        num: '01',
        name: 'Rychlé zpracování',
        text: 'Ozveme se. Domluvíme termín. Držíme ho.',
      },
      {
        num: '02',
        name: 'Férová cena',
        text: 'Cenu řekneme dopředu. Na konci žádné překvapení.',
      },
      {
        num: '03',
        name: 'Kvalitní práce',
        text: 'Pořádné spoje, pořádné dřevo, pořádná montáž.',
      },
      {
        num: '04',
        name: 'Záruka',
        text: 'Na konstrukci dáváme záruku. Když něco není v pořádku, řešíme to.',
      },
    ],
  },
  gallery: {
    id: 'realizace',
    kicker: 'Realizace',
    title: 'Práce, která je vidět.',
    showMore: 'Zobrazit více',
    back: 'Zpět na realizace',
    lightbox: {
      close: 'Zavřít',
      prev: 'Předchozí fotka',
      next: 'Další fotka',
    },
    projects: [
      {
        slug: 'pergola2',
        name: 'Pergola / Dolní Domaslavice / 2026',
        photos: [
          { src: '/images/pergola2/pergola2-01.jpg', alt: 'Pergola u domu s posezením a jídelním stolem' },
          { src: '/images/pergola2/pergola2-02.jpg', alt: 'Dřevěná pergola s taškovou střechou u domu' },
        ],
      },
      {
        slug: 'pergola',
        name: 'Pergola / Hnojník / 2026',
        photos: [
          { src: '/images/pergola/pergola-01.webp', alt: 'Dřevěná pergola s posezením' },
          { src: '/images/pergola/pergola-02.webp', alt: 'Pergola se šikmou střechou' },
          { src: '/images/pergola/pergola-03.webp', alt: 'Posezení pod pergolou s houpacím křeslem' },
          { src: '/images/pergola/pergola-04.webp', alt: 'Interiér pergoly s ratanovým posezením' },
          { src: '/images/pergola/pergola-05.webp', alt: 'Krov a osvětlení pergoly' },
        ],
      },
      {
        slug: 'vstup',
        name: 'Přístřešek / Hnojník / 2026',
        photos: [
          { src: '/images/vstup/vstup-01.webp', alt: 'Dřevěný přístřešek nad vstupem' },
          { src: '/images/vstup/vstup-02.webp', alt: 'Čelní pohled na vstup se stříškou' },
          { src: '/images/vstup/vstup-03.webp', alt: 'Detail stříšky nad dveřmi' },
          { src: '/images/vstup/vstup-04.webp', alt: 'Dřevěné trámy vstupu' },
          { src: '/images/vstup/vstup-05.webp', alt: 'Štít stříšky nad vstupem' },
        ],
      },
    ],
  },
  footer: {
    id: 'kontakt',
    kicker: 'Kontakt',
    title: 'Máte zájem? Kontaktujte nás.',
    or: 'nebo',
    form: {
      firstName: 'Jméno',
      lastName: 'Příjmení',
      phone: 'Telefonní číslo',
      email: 'E-mail',
      message: 'Zpráva (nepovinné)',
      submit: 'Odeslat',
      sending: 'Odesílám…',
      successTitle: 'Odesláno!',
      successText: 'Brzy se vám ozveme.',
      errors: {
        firstName: 'Zadejte jméno.',
        lastName: 'Zadejte příjmení.',
        email: 'Zadejte platnou e-mailovou adresu.',
        phone: 'Zadejte telefonní číslo.',
        phoneInvalid: 'Zadejte platné telefonní číslo.',
        send: 'Odeslání se nepovedlo. Zkuste to znovu, nebo zavolejte.',
      },
    },
  },
} as const

export type Project = (typeof site.gallery.projects)[number]
export type Photo = Project['photos'][number]

export function getProject(slug: string | undefined) {
  return site.gallery.projects.find((project) => project.slug === slug)
}

export function projectPath(slug: string) {
  return `/realizace/${slug}`
}

export function extraPhotoLabel(count: number) {
  const n = Math.abs(count)
  const n100 = n % 100
  const n10 = n % 10
  const word =
    n100 >= 11 && n100 <= 14
      ? 'fotek'
      : n10 === 1
        ? 'fotka'
        : n10 >= 2 && n10 <= 4
          ? 'fotky'
          : 'fotek'
  return `+${n} ${word}`
}
