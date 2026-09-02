export const site = {
  name: 'RAJWOOD',
  region: 'Moravskoslezský kraj',
  seat: 'Hnojník',
  address: 'Hnojník 394',
  owner: 'Lukáš Rajnoha',
  ico: '000000000',
  credit: 'Vytvořil Adam Jašúrek',
  email: '',
  warrantyYears: 'X',
  logo: {
    src: '/images/logo.png',
    headerSrc: '/images/svetle-logo.png',
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
    ctaHref: '#realizace',
    image: {
      src: '/images/hero-pergola.png',
      alt: 'Zakázková dřevěná pergola',
    },
  },
  nav: [
    { href: '#sluzby', label: 'Služby' },
    { href: '#proc', label: 'Proč my' },
    { href: '#realizace', label: 'Realizace' },
    { href: '#kontakt', label: 'Kontakt' },
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
    projects: [
      {
        name: 'Pergola / Hnojník / 2026',
        photos: [
          { src: '/images/pergola/pergola-01.webp', alt: 'Pergola s posezením a houpacím křeslem' },
          { src: '/images/pergola/pergola-02.webp', alt: 'Posezení pod pergolou' },
          { src: '/images/pergola/pergola-03.webp', alt: 'Interiér pergoly' },
          { src: '/images/pergola/pergola-04.webp', alt: 'Krov a osvětlení pergoly' },
          { src: '/images/pergola/pergola-05.webp', alt: 'Strop pergoly' },
          { src: '/images/pergola/pergola-06.webp', alt: 'Spoje krovu' },
          { src: '/images/pergola/pergola-07.webp', alt: 'Konstrukce pergoly' },
        ],
      },
      {
        name: 'Vstup / Hnojník / 2026',
        photos: [
          { src: '/images/vstup/vstup-01.webp', alt: 'Dřevěný přístřešek nad vstupem' },
          { src: '/images/vstup/vstup-02.webp', alt: 'Vstup se dřevěnou stříškou' },
          { src: '/images/vstup/vstup-03.webp', alt: 'Detail stříšky nad dveřmi' },
          { src: '/images/vstup/vstup-04.webp', alt: 'Dřevěné trámy vstupu' },
          { src: '/images/vstup/vstup-05.webp', alt: 'Čelní pohled na vstup' },
          { src: '/images/vstup/vstup-06.webp', alt: 'Štít stříšky' },
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
      message: 'Zpráva',
      submit: 'Odeslat',
    },
  },
} as const
