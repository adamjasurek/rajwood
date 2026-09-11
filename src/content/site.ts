export const site = {
  name: 'RAJWOOD',
  documentTitle: 'RAJWOOD — Pergoly a přístřešky | Hnojník',
  region: 'Moravskoslezský kraj',
  seat: 'Hnojník',
  address: 'Hnojník 394',
  owner: 'Lukáš Rajnoha',
  ico: '000000000',
  credit: 'Vytvořil Adam Jašúrek',
  creditHref: 'https://adamjasurek.cz',
  email: 'lukas@rajwood.com',
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
    instagram: '',
    facebook: '',
  },
  hero: {
    kicker: 'Po celém Moravskoslezském kraji',
    title: 'Dřevěné pergoly\nna míru',
    subtitle: 'Stavíme zakázkové pergoly, přístřešky a zahradní kůlny.',
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
    { href: '/#realizace', label: 'Realizace' },
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
        text: 'Na auto, na dřevo, na posezení. Konstrukce podle místa a toho, co má stavba unést.',
      },
      {
        name: 'Pergoly',
        text: 'Otevřené i se střechou. Na terasu, k domu, nebo volně do zahrady.',
      },
      {
        name: 'Kůlny',
        text: 'Nářaďovny a úložné stavby. Jednoduché, suché, navržené tak, aby vydržely.',
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
      },
      {
        name: 'Férová cena',
        text: 'Cenu řekneme dopředu. Na konci žádné překvapení.',
      },
      {
        name: 'Poctivé řemeslo',
        text: 'Pořádné spoje, pořádné dřevo, pořádná montáž.',
      },
    ],
  },
  gallery: {
    id: 'realizace',
    title: 'Vybrané realizace',
    lightbox: {
      close: 'Zavřít',
      prev: 'Předchozí fotka',
      next: 'Další fotka',
    },
    projects: [
      {
        slug: 'stani',
        name: 'Stání / Kunčičky u Bašky / 2026',
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
        photos: [
          { src: '/images/pergola2/pergola2-01.webp', alt: 'Pergola u domu s posezením a jídelním stolem' },
          { src: '/images/pergola2/pergola2-02.webp', alt: 'Dřevěná pergola s taškovou střechou u domu' },
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
      successText: 'Brzy se vám ozveme.',
      consent: 'Souhlasím se zpracováním',
      consentLink: 'osobních údajů',
      errors: {
        firstName: 'Zadejte jméno.',
        lastName: 'Zadejte příjmení.',
        email: 'Zadejte platnou e-mailovou adresu.',
        phone: 'Zadejte telefonní číslo.',
        phoneInvalid: 'Zadejte platné telefonní číslo.',
        consent: 'Pro odeslání je potřeba souhlas se zpracováním údajů.',
        send: 'Odeslání se nepovedlo. Zkuste to znovu, nebo zavolejte.',
      },
    },
  },
  legal: {
    terms: {
      path: '/obchodni-podminky',
      label: 'Obchodní podmínky',
      title: 'Obchodní podmínky',
      updated: 'Pracovní verze — 10. 9. 2026',
      intro:
        'Tyto obchodní podmínky upravují poptávku a realizaci zakázkových dřevostaveb značky RAJWOOD. Text je zatím ukázkový placeholder — před ostrým provozem ho doplňte o IČO, daňový režim a nechte zkontrolovat.',
      sections: [
        {
          heading: '1. Poskytovatel',
          paragraphs: [
            'Služby poskytuje Lukáš Rajnoha, RAJWOOD, místo podnikání Hnojník 394, Moravskoslezský kraj. IČO: 000000000 (doplňte). E-mail: lukas@rajwood.com. Telefon: +420 736 235 553.',
            'Nejsme-li plátci DPH, uváděné ceny jsou konečné. Jsme-li plátci DPH, daň se připočte podle platných předpisů. Konkrétní režim doplňte podle skutečnosti.',
          ],
        },
        {
          heading: '2. Služby',
          paragraphs: [
            'Nabízíme zakázkovou výrobu a montáž dřevěných pergol, přístřešků, kůlen a souvisejících dřevostaveb, včetně návrhu konstrukce podle místa stavby. Rozsah každé zakázky vyplývá z potvrzené nabídky.',
          ],
        },
        {
          heading: '3. Poptávka a smlouva',
          paragraphs: [
            'Poptávka odeslaná formulářem, e-mailem nebo telefonem není smlouvou. Na jejím základě připravíme nezávaznou nabídku. Smlouva vzniká až potvrzením nabídky — e-mailem, písemně, nebo podpisem.',
            'Nabídka platí po dobu v ní uvedenou. Pokud doba uvedena není, platí 30 dní od odeslání, není-li dohodnuto jinak.',
          ],
        },
        {
          heading: '4. Cena a platba',
          paragraphs: [
            'Cena je sjednána v nabídce. Obvykle požadujeme zálohu před objednáním materiálu a doplatek po dokončení, případně podle splátkového kalendáře v nabídce.',
            'Platby probíhají převodem na účet uvedený v nabídce, nebo jiným dohodnutým způsobem. Vlastnictví dodaných prvků přechází na zákazníka až po úplném zaplacení.',
          ],
        },
        {
          heading: '5. Termín a realizace',
          paragraphs: [
            'Termín v nabídce je orientační, pokud není výslovně sjednán jako závazný. Může se posunout kvůli počasí, dodávkám materiálu, součinnosti zákazníka, nebo okolnostem, které nemůžeme ovlivnit.',
            'O podstatném posunu termínu zákazníka včas informujeme a navrhneme náhradní řešení.',
          ],
        },
        {
          heading: '6. Součinnost zákazníka',
          paragraphs: [
            'Zákazník zajistí včasný přístup na pozemek, možnost příjezdu, místo pro materiál a montáž a pravdivé informace o stavbě, sítích a podloží. Pokud to zakázka vyžaduje, zajistí také potřebná povolení.',
            'Zpoždění nebo vady způsobené chybějící součinností jdou k tíži zákazníka, včetně nákladů na čekání, vícepráce a skladování materiálu.',
          ],
        },
        {
          heading: '7. Předání díla',
          paragraphs: [
            'Po dokončení dílo předáme. Zjevné vady a nedodělky je potřeba uvést při předání. Tím není dotčena odpovědnost za skryté vady a zákonná práva z vadného plnění.',
          ],
        },
        {
          heading: '8. Záruka a reklamace',
          paragraphs: [
            'Platí zákonná práva z vadného plnění. Na konstrukci můžeme sjednat delší záruku — konkrétní délka a rozsah budou v nabídce nebo ve smlouvě.',
            'Záruka se nevztahuje na běžné stárnutí dřeva, zanedbanou údržbu, neodborné zásahy, přetížení konstrukce, živelní události a vady podkladu, který nezajišťoval RAJWOOD.',
            'Reklamaci zašlete e-mailem na lukas@rajwood.com, ideálně s fotografiemi a popisem. Vadné plnění řešíme opravou, doplněním, nebo přiměřenou slevou.',
          ],
        },
        {
          heading: '9. Zrušení zakázky',
          paragraphs: [
            'Zruší-li zákazník zakázku před zahájením prací, můžeme požadovat náhradu účelně vynaložených nákladů na přípravu a zaměření. Po objednání materiálu také cenu materiálu, který nelze bez ztráty vrátit, a již provedené práce.',
          ],
        },
        {
          heading: '10. Odpovědnost',
          paragraphs: [
            'Odpovídáme za škodu způsobenou porušením svých povinností v rozsahu občanského zákoníku. Neodpovídáme za ušlý zisk a nepřímou škodu nad rámec kogentních ustanovení zákona, ani za škody vzniklé okolnostmi vyšší moci.',
          ],
        },
        {
          heading: '11. Závěrečná ustanovení',
          paragraphs: [
            'Řídí se právem České republiky. Spory se snažíme řešit dohodou. Odchylná ujednání v potvrzené nabídce mají přednost před těmito podmínkami.',
            'Aktuální znění je zveřejněno na této stránce. Na již potvrzené zakázky se použije znění platné v den vzniku smlouvy, pokud se nedohodneme jinak.',
          ],
        },
      ],
    },
    privacy: {
      path: '/gdpr',
      label: 'Ochrana osobních údajů',
      title: 'Ochrana osobních údajů',
      updated: 'Pracovní verze — 10. 9. 2026',
      intro:
        'Tato informace popisuje, jak RAJWOOD zpracovává osobní údaje návštěvníků webu a zájemců o zakázku. Jde o ukázkový placeholder podle GDPR — před spuštěním doplňte IČO a ověřte, že odpovídá vaší praxi.',
      sections: [
        {
          heading: '1. Správce údajů',
          paragraphs: [
            'Správcem je Lukáš Rajnoha, RAJWOOD, Hnojník 394, IČO: 000000000 (doplňte). Kontakt: lukas@rajwood.com, telefon +420 736 235 553.',
          ],
        },
        {
          heading: '2. Jaké údaje zpracováváme',
          paragraphs: [
            'Z poptávkového formuláře a z další komunikace zpracováváme zejména jméno, příjmení, telefon, e-mail, obsah zprávy a údaje, které nám sami sdělíte (například adresa realizace, představa o stavbě).',
            'Web nevede uživatelské účty a nevyžaduje registraci.',
          ],
        },
        {
          heading: '3. Účel a právní základ',
          paragraphs: [
            'Údaje používáme k vyřízení poptávky, přípravě nabídky, plnění smlouvy, komunikaci o zakázce a k plnění zákonných povinností (účetnictví, záruky).',
          ],
          items: [
            'jednání o smlouvě a plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR),',
            'oprávněný zájem na vyřízení poptávky a obraně právních nároků (čl. 6 odst. 1 písm. f) GDPR),',
            'souhlas udělený zaškrtnutím políčka ve formuláři (čl. 6 odst. 1 písm. a) GDPR),',
            'plnění právní povinnosti, vznikne-li zakázka (čl. 6 odst. 1 písm. c) GDPR).',
          ],
        },
        {
          heading: '4. Jak dlouho údaje držíme',
          paragraphs: [
            'Poptávky, ze kterých nevznikne zakázka, uchováváme zpravidla 12 měsíců od poslední komunikace. Údaje k uzavřené zakázce držíme po dobu záruky a po dobu stanovenou účetními a daňovými předpisy.',
            'Souhlas můžete kdykoli odvolat e-mailem. Odvolání se nedotýká zpracování, které probíhalo před odvoláním, ani zpracování na jiném právním základě.',
          ],
        },
        {
          heading: '5. Kdo k údajům má přístup',
          paragraphs: [
            'Údaje z formuláře se odesílají přes službu FormSubmit (formsubmit.co), která doručí poptávku na náš e-mail. Dále mohou údaje v nezbytném rozsahu zpracovávat poskytovatel hostingu webu a, vznikne-li zakázka, účetní nebo daňový poradce.',
            'Údaje nepředáváme k marketingu třetím stranám a neprodáváme je.',
          ],
        },
        {
          heading: '6. Vaše práva',
          paragraphs: [
            'V rozsahu GDPR můžete požadovat přístup k údajům, opravu, výmaz, omezení zpracování, přenositelnost a vznést námitku proti zpracování založenému na oprávněném zájmu. Máte také právo podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz).',
            'Žádosti posílejte na lukas@rajwood.com. Odpovíme bez zbytečného odkladu, nejpozději do 30 dnů.',
          ],
        },
        {
          heading: '7. Cookies a měření',
          paragraphs: [
            'Web nepoužívá marketingové ani statistické cookies třetích stran. Technicky mohou vzniknout pouze nezbytné údaje potřebné k zobrazení stránek a odeslání formuláře. Pokud později doplníme měření návštěvnosti, tuto informaci aktualizujeme.',
          ],
        },
        {
          heading: '8. Změny',
          paragraphs: [
            'Aktuální znění je vždy na této stránce. Podstatné změny uvedeme novým datem v záhlaví.',
          ],
        },
      ],
    },
  },
} as const

export type Project = (typeof site.gallery.projects)[number]
export type Photo = Project['photos'][number]

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
