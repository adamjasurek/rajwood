import { Link } from 'react-router-dom'
import { site } from '../content/site'

type LegalKey = keyof typeof site.legal

export function LegalPage({ kind }: { kind: LegalKey }) {
  const page = site.legal[kind]
  const other = kind === 'terms' ? site.legal.privacy : site.legal.terms

  return (
    <main className="border-b border-line">
      <article className="mx-auto max-w-[40rem] px-4 py-10 sm:px-5 sm:py-16 lg:py-20">
        <p className="mb-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-mute sm:text-[0.72rem] sm:tracking-[0.22em]">
          {page.updated}
        </p>
        <h1 className="text-balance font-serif text-[1.85rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.75rem]">
          {page.title}
        </h1>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-mute">{page.intro}</p>

        <div className="mt-10 space-y-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-[1.35rem] font-medium tracking-[-0.02em] sm:text-[1.5rem]">
                {section.heading}
              </h2>
              {section.paragraphs.map((text) => (
                <p key={text} className="mt-3 leading-relaxed text-ink/90">
                  {text}
                </p>
              ))}
              {'items' in section ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink/90">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-line pt-6 text-[0.95rem] text-mute">
          <Link
            to={other.path}
            className="inline-flex min-h-11 items-center text-ink no-underline hover:underline"
          >
            {other.label}
          </Link>
          <span aria-hidden="true"> · </span>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center text-ink no-underline hover:underline"
          >
            Zpět na úvod
          </Link>
        </p>
      </article>
    </main>
  )
}
