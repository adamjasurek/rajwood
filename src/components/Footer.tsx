import { useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ContactForm } from './ContactForm'
import { site } from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M14 8.5V6.8c0-.7.5-1.3 1.5-1.3H17V3h-2.2C12.4 3 11 4.5 11 6.6V8.5H9v2.5h2V21h3v-10h2.2l.8-2.5H14Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Footer() {
  const root = useRef<HTMLElement>(null)
  const location = useLocation()
  const year = new Date().getFullYear()
  const showContact = location.pathname === '/'

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.from('[data-fade]', {
              y: 28,
              autoAlpha: 0,
              duration: 0.85,
              stagger: 0.08,
            })
          },
        })
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [showContact], revertOnUpdate: true },
  )

  const socials = [
    { href: site.social.instagram, label: 'Instagram', icon: <InstagramIcon /> },
    { href: site.social.facebook, label: 'Facebook', icon: <FacebookIcon /> },
  ]

  return (
    <footer
      ref={root}
      id={showContact ? site.footer.id : undefined}
      className={showContact ? 'pt-12 sm:pt-20 lg:pt-24' : 'pt-8 sm:pt-10'}
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-5">
        {showContact ? (
          <>
            <h2
              data-fade
              className="mx-auto max-w-[14ch] text-balance text-center font-serif text-[1.85rem] font-medium leading-tight tracking-[-0.02em] sm:text-[3rem]"
            >
              {site.footer.title}
            </h2>

            <div data-fade>
              <ContactForm />
            </div>

            <p
              data-fade
              className="mx-auto mt-10 flex max-w-[36rem] items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-mute sm:mt-12 sm:gap-4 sm:text-[0.72rem] sm:tracking-[0.22em]"
            >
              <span className="h-px flex-1 bg-line" />
              {site.footer.or}
              <span className="h-px flex-1 bg-line" />
            </p>

            <article
              data-fade
              className="mx-auto mt-8 w-full max-w-[22rem] border border-line px-6 py-8 text-left sm:mt-10 sm:px-10 sm:py-10"
            >
              <p className="font-serif text-[1.65rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.05rem]">
                {site.owner}
              </p>
              <div aria-hidden className="mt-5 h-px w-12 bg-wood" />

              <dl className="mt-6 space-y-4">
                {site.email ? (
                  <div>
                    <dt className="text-[0.72rem] tracking-[0.16em] text-mute">
                      mail
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${site.email}`}
                        className="inline-flex min-h-11 items-center text-[1.05rem] text-ink no-underline hover:underline"
                      >
                        {site.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-[0.72rem] tracking-[0.16em] text-mute">
                    tel
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${site.phone.tel}`}
                      className="inline-flex min-h-11 items-center text-[1.05rem] text-ink no-underline hover:underline"
                    >
                      {site.phone.display}
                    </a>
                  </dd>
                </div>
              </dl>

              <p className="mt-7 text-[0.9rem] text-mute">{site.footer.hours}</p>
            </article>
          </>
        ) : null}

        <div
          data-fade
          className={
            showContact ? 'mt-10 border-t border-line pt-6 sm:mt-14 sm:pt-8' : ''
          }
        >
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <Link
                to="/"
                aria-label={site.name}
                onClick={() => window.scrollTo({ top: 0 })}
                className="inline-block shrink-0 text-ink no-underline"
              >
                <img
                  src={site.logo.src}
                  alt=""
                  className="h-11 w-auto sm:h-16"
                />
              </Link>
              <div className="min-w-0 text-[0.88rem] leading-snug text-mute sm:text-[0.95rem]">
                <p className="text-ink">{site.name}</p>
                <p className="mt-0.5">{site.address}</p>
              </div>
            </div>

            <ul className="flex shrink-0 gap-2 sm:gap-3">
              {socials.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="flex h-10 w-10 items-center justify-center border border-line text-ink no-underline sm:h-11 sm:w-11"
                    >
                      {item.icon}
                    </a>
                  ) : (
                    <span
                      aria-label={`${item.label} — odkaz doplníme`}
                      className="flex h-10 w-10 items-center justify-center border border-line text-mute sm:h-11 sm:w-11"
                    >
                      {item.icon}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          data-sticky-hide
          className="mt-5 border-t border-line pt-3 pb-[max(1.15rem,env(safe-area-inset-bottom))] md:mt-10 md:pt-4 md:pb-5"
        >
          <div className="flex flex-col items-center gap-0 text-center text-[0.8rem] leading-snug text-mute sm:grid sm:grid-cols-3 sm:items-center sm:gap-6 sm:text-[0.9rem]">
            <nav
              aria-label="Právní informace"
              className="sm:justify-self-start sm:text-left"
            >
              <Link
                to={site.legal.privacy.path}
                aria-current={location.pathname === site.legal.privacy.path ? 'page' : undefined}
                className={`inline-flex min-h-10 items-center no-underline hover:underline ${
                  location.pathname === site.legal.privacy.path ? 'text-ink' : 'text-mute'
                }`}
              >
                {site.legal.privacy.label}
              </Link>
            </nav>
            <p className="py-1 sm:justify-self-center sm:py-0 sm:text-center">
              {site.owner} © {year}
              <span className="sm:ml-3 sm:inline">
                <span className="mx-1.5 sm:hidden" aria-hidden>
                  ·
                </span>
                IČO: {site.ico}
              </span>
            </p>
            <p className="sm:justify-self-end sm:text-right">
              <a
                href={site.creditHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center text-mute no-underline hover:underline"
              >
                {site.credit}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
