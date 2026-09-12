export const site = {
  name: 'RAJWOOD',
  url: 'https://rajwood.com',
  region: 'Moravskoslezský kraj',
  seat: 'Hnojník',
  address: 'Hnojník 394',
  postalCode: '739 53',
  owner: 'Lukáš Rajnoha',
  ico: '000000000',
  credit: 'Vytvořil Adam Jašúrek',
  creditHref: 'https://adamjasurek.cz',
  email: 'rajwood@seznam.cz',
  logo: {
    src: '/images/logo.webp',
    headerSrc: '/images/svetle-logo.webp',
    markSrc: '/images/svetle-znak.webp',
    fallbackSrc: '/logo.svg',
  },
  phone: {
    display: '+420 736 235 553',
    tel: '+420736235553',
  },
  social: {
    instagram: 'https://www.instagram.com/rajwood_pergoly/',
    facebook: '',
  },
  hero: {
    kicker: 'Po celém Moravskoslezském kraji',
    title: 'Dřevěné pergoly\nna míru',
    subtitle: 'Stavíme pergoly na míru vašim přáním a potřebám.',
    cta: 'Prohlédnout práce',
    ctaHref: '/#realizace',
    image: {
      src: '/images/hero-pergola.webp',
      alt: 'Zakázková dřevěná pergola',
    },
  },
  nav: [
    { href: '/#sluzby', label: 'Služby' },
    { href: '/#proc', label: 'Proč my' },
    { href: '/realizace', label: 'Realizace' },
    { href: '/#kontakt', label: 'Kontakt' },
  ],
  services: {
    id: 'sluzby',
    title: 'Dřevostavby',
    titleRest: 'všeho druhu',
    images: [
      {
        src: '/images/vstup/vstup-01.webp',
        alt: 'Dřevěný přístřešek nad vstupem',
        caption: 'Přístřešek / Hnojník',
      },
      {
        src: '/images/pergola2/pergola2-01.webp',
        alt: 'Zakázková dřevěná pergola s posezením',
        caption: 'Pergola / Dolní Domaslavice',
      },
      {
        src: '/images/stani/stani-01.webp',
        alt: 'Dřevěné stání s dlažbou před domem',
        caption: 'Stání / Kunčičky u Bašky',
      },
    ],
    items: [
      {
        name: 'Přístřešky',
        text: 'Na auto, na dřevo, na posezení. Konstrukce podle místa a toho, co má stavba unést a k jakému účelu má sloužit.',
      },
      {
        name: 'Pergoly',
        text: 'Otevřené i se střechou. K domu, nebo volně do zahrady.',
      },
      {
        name: 'Kůlny',
        text: 'Nářaďovny a úložné stavby. Jednoduché, navržené tak, aby vydržely.',
      },
    ],
  },
  values: {
    id: 'proc',
    kicker: 'Proč RAJWOOD?',
    title: 'Stojíme si za svou prací.',
    items: [
      {
        name: 'Rychlé zpracování',
        text: 'Ozveme se. Domluvíme termín. Držíme ho.',
        icon: 'clock',
      },
      {
        name: 'Férová cena',
        text: 'Cenu řekneme dopředu. Na konci žádné překvapení.',
        icon: 'handshake',
      },
      {
        name: 'Poctivé řemeslo',
        text: 'Pořádné spoje, pořádné dřevo, pořádná montáž.',
        icon: 'hammer',
      },
    ],
  },
  gallery: {
    id: 'realizace',
    path: '/realizace',
    title: 'Vybrané realizace',
    pageTitle: 'Realizace',
    allCta: 'Zobrazit všechny práce',
    lightbox: {
      close: 'Zavřít',
      prev: 'Předchozí fotka',
      next: 'Další fotka',
    },
    projects: [
      {
        slug: 'stani',
        name: 'Stání / Kunčičky u Bašky / 2026',
        featured: false,
        photos: [
          { src: '/images/stani/stani-01.webp', alt: 'Dřevěné stání s dlažbou před domem' },
          { src: '/images/stani/stani-02.webp', alt: 'Roh dřevěného plotu u stání' },
          { src: '/images/stani/stani-03.webp', alt: 'Dlažba stání z nadhledu' },
          { src: '/images/stani/stani-04.webp', alt: 'Pohled ze stání k domu' },
          { src: '/images/stani/stani-05.webp', alt: 'Boční pohled na stání u louky' },
          { src: '/images/stani/stani-06.webp', alt: 'Stání s plotem a příjezdem' },
        ],
      },
      {
        slug: 'pergola2',
        name: 'Pergola / Dolní Domaslavice / 2026',
        featured: true,
        photos: [
          { src: '/images/pergola2/pergola2-01.webp', alt: 'Pergola u domu s posezením' },
          { src: '/images/pergola2/pergola2-02.webp', alt: 'Dřevěná pergola u domu' },
        ],
      },
      {
        slug: 'pergola',
        name: 'Pergola / Hnojník / 2026',
        featured: true,
        photos: [
          { src: '/images/pergola/pergola-01.webp', alt: 'Dřevěná pergola s posezením' },
          { src: '/images/pergola/pergola-02.webp', alt: 'Pergola s posezením' },
          { src: '/images/pergola/pergola-03.webp', alt: 'Posezení a houpací křeslo pod pergolou' },
          { src: '/images/pergola/pergola-04.webp', alt: 'Interiér pergoly s ratanovým posezením' },
          { src: '/images/pergola/pergola-05.webp', alt: 'Krov a osvětlení pergoly' },
        ],
      },
      {
        slug: 'vstup',
        name: 'Přístřešek / Hnojník / 2026',
        featured: true,
        photos: [
          { src: '/images/vstup/vstup-01.webp', alt: 'Dřevěný přístřešek nad vstupem' },
          { src: '/images/vstup/vstup-02.webp', alt: 'Čelní pohled na vstup se stříškou' },
          { src: '/images/vstup/vstup-03.webp', alt: 'Detail stříšky nad dveřmi' },
          { src: '/images/vstup/vstup-04.webp', alt: 'Dřevěné trámy vstupu' },
          { src: '/images/vstup/vstup-05.webp', alt: 'Detail trámů stříšky' },
        ],
      },
    ],
  },
  footer: {
    id: 'kontakt',
    title: 'Máte zájem? Kontaktujte nás.',
    or: 'nebo',
    hours: 'Volejte po–pá 8–16',
    form: {
      firstName: 'Jméno',
      lastName: 'Příjmení',
      phone: 'Telefonní číslo',
      email: 'E-mail',
      message: 'Zpráva (nepovinné)',
      submit: 'Odeslat',
      sending: 'Odesílám…',
      successTitle: 'Odesláno!',
      successText:
        'Shrnutí poptávky jsme poslali na váš e-mail. Brzy se vám ozveme.',
      consent: 'Souhlasím se zpracováním',
      consentLink: 'osobních údajů',
      errors: {
        firstName: 'Zadejte jméno.',
        lastName: 'Zadejte příjmení.',
        email: 'Zadejte e-mailovou adresu.',
        emailInvalid: 'Zadejte platnou e-mailovou adresu.',
        phone: 'Zadejte telefonní číslo.',
        phoneInvalid: 'Zadejte platné telefonní číslo.',
        consent: 'Pro odeslání je potřeba souhlas se zpracováním údajů.',
        send: 'Odeslání se nepovedlo. Zkuste to znovu, nebo zavolejte.',
      },
    },
  },
  seo: {
    ogImage: '/images/og.jpg',
    home: {
      title: 'Rajwood | Pergoly na míru vašim přáním a potřebám',
      description:
        'Stavíme zakázkové dřevěné pergoly, přístřešky a kůlny po celém Moravskoslezském kraji.',
    },
    realizations: {
      title: 'Realizace - Pergoly, přístřešky, kůlny, stání a mnoho dalšího',
      description:
        'Fotogalerie našich realizací v Hnojníku, Dolních Domaslavicích, Kunčičkách u Bašky a okolí',
    },
    privacy: {
      title: 'Ochrana osobních údajů | RAJWOOD',
      description: 'Zásady zpracování osobních údajů',
    },
    notFound: {
      title: 'Stránka nenalezena | RAJWOOD',
    },
  },
  notFound: {
    code: '404',
    title: 'Tato stránka neexistuje.',
    cta: 'Zpět na úvod',
  },
  legal: {
    privacy: {
      path: '/gdpr',
      label: 'Ochrana osobních údajů',
      title: 'Zásady zpracování osobních údajů',
      updated: 'Aktualizováno 11. 9. 2026',
      effective: 'Tyto podmínky nabývají účinnosti dnem 11. 9. 2026.',
      intro:
        'Tyto zásady popisují, jaké osobní údaje zpracováváme v souvislosti s webem rajwood.com a s poptávkou přes kontaktní formulář.',
      sections: [
        {
          heading: '1. Kdo zpracovává vaše údaje',
          paragraphs: [
            'Správcem vašich osobních údajů je Lukáš Rajnoha, se sídlem Hnojník 394, 739 53 Hnojník, IČO: 00000000, zapsán v živnostenském rejstříku.',
            'E-mail: rajwood@seznam.cz',
            'Telefon: +420 736 235 553',
            '(dále jen „Správce“)',
          ],
        },
        {
          heading: '2. Jaké údaje zpracováváme a proč',
          paragraphs: [
            'Osobní údaje z kontaktního formuláře zpracováváme výhradně za účelem vyřízení vaší poptávky na realizaci pergoly, jejího nacenění a následné komunikace.',
            'Zpracováváme tyto vámi poskytnuté údaje:',
          ],
          items: [
            'Jméno a příjmení',
            'E-mailová adresa',
            'Telefonní číslo',
            'Specifikace a úpravy poptávané realizace',
          ],
          closing: [
            'Právním základem pro toto zpracování je nezbytnost pro provedení opatření přijatých před uzavřením smlouvy na žádost subjektu údajů (vyřízení vaší poptávky a příprava nabídky) ve smyslu čl. 6 odst. 1 písm. b) nařízení GDPR.',
          ],
        },
        {
          heading: '3. Jak dlouho údaje uchováváme',
          paragraphs: [
            'Pokud po odeslání poptávky nedojde k následné realizaci zakázky, vaše osobní údaje po 12 měsících od poslední komunikace bezpečně smažeme.',
            'Pokud k realizaci dojde, uchováváme nezbytné fakturační a smluvní údaje po dobu stanovenou platnými zákony (zejména zákonem o účetnictví a zákonem o DPH).',
          ],
        },
        {
          heading: '4. Kdo další k údajům může mít přístup (Zpracovatelé)',
          paragraphs: [
            'Vaše osobní údaje nikomu neprodáváme. Při provozu webu využíváme tyto zpracovatele:',
          ],
          items: [
            'Hosting webu: společnost Vercel Inc.',
            'Písma na webu (Google Fonts): společnost Google Ireland Limited',
          ],
          closing: [
            'Při načtení stránek může Google zpracovat vaši IP adresu a základní údaje o prohlížeči výhradně za účelem doručení písem. Tyto údaje nepoužíváme k marketingu.',
            'Na našem webu nevyužíváme žádné marketingové ani analytické sledovací nástroje (tzv. cookies třetích stran) a vaše data nezařazujeme do žádných databází pro rozesílání newsletterů.',
          ],
        },
        {
          heading: '5. Jaká máte práva',
          paragraphs: [
            'V souvislosti se zpracováním osobních údajů máte právo:',
          ],
          items: [
            'Požádat o informaci, jaké vaše osobní údaje zpracováváme.',
            'Požadovat opravu nepřesných nebo neaktuálních údajů.',
            'Požadovat úplný výmaz vašich osobních údajů, pokud již nejsou potřeba pro účely, pro které byly shromážděny (a nebrání tomu zákonná povinnost).',
          ],
          closing: [
            'Pro uplatnění těchto práv nás stačí kontaktovat na e-mailu rajwood@seznam.cz.',
            'Pokud se domníváte, že s vašimi daty nakládáme v rozporu se zákonem, máte právo podat stížnost u Úřadu pro ochranu osobních údajů (ÚOOÚ).',
          ],
        },
      ],
    },
  },
} as const

export type Project = (typeof site.gallery.projects)[number]
export type Photo = Project['photos'][number]

export function homeProjects() {
  return site.gallery.projects.filter((project) => project.featured)
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
