import { useRef } from 'react'
import { Link } from 'react-router-dom'
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
  const year = new Date().getFullYear()

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
    { scope: root },
  )

  const socials = [
    { href: site.social.instagram, label: 'Instagram', icon: <InstagramIcon /> },
    { href: site.social.facebook, label: 'Facebook', icon: <FacebookIcon /> },
  ]

  return (
    <footer
      ref={root}
      id={site.footer.id}
      className="pt-16 sm:pt-20 lg:pt-24"
    >
      <div className="mx-auto max-w-[1120px] px-5">
        <p
          data-fade
          className="mb-3 text-center text-[0.72rem] font-medium uppercase tracking-[0.22em] text-mute"
        >
          {site.footer.kicker}
        </p>
        <h2
          data-fade
          className="mx-auto max-w-[14ch] text-center font-serif text-[2.15rem] font-medium leading-tight tracking-[-0.02em] sm:text-[3rem]"
        >
          {site.footer.title}
        </h2>

        <div data-fade>
          <ContactForm />
        </div>

        <p
          data-fade
          className="mx-auto mt-12 flex max-w-[36rem] items-center gap-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-mute"
        >
          <span className="h-px flex-1 bg-line" />
          {site.footer.or}
          <span className="h-px flex-1 bg-line" />
        </p>

        <article
          data-fade
          className="mx-auto mt-10 w-full max-w-[22rem] border border-line px-8 py-9 text-left sm:px-10 sm:py-10"
        >
          <p className="font-serif text-[1.85rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.05rem]">
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
                    className="text-[1.05rem] text-ink no-underline hover:underline"
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
                  className="text-[1.05rem] text-ink no-underline hover:underline"
                >
                  {site.phone.display}
                </a>
              </dd>
            </div>
          </dl>

          <p className="mt-7 text-[0.9rem] text-mute">{site.footer.hours}</p>
        </article>

        <div data-fade className="mt-12 border-t border-line pt-8 sm:mt-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                aria-label={site.name}
                onClick={() => window.scrollTo({ top: 0 })}
                className="inline-block shrink-0 text-ink no-underline"
              >
                <img
                  src={site.logo.src}
                  alt=""
                  className="h-14 w-auto sm:h-16"
                />
              </Link>
              <div className="text-[0.95rem] text-mute">
                <p className="text-ink">{site.name}</p>
                <p className="mt-1">{site.address}</p>
              </div>
            </div>

            <ul className="flex gap-3">
              {socials.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="flex h-11 w-11 items-center justify-center border border-line text-ink no-underline"
                    >
                      {item.icon}
                    </a>
                  ) : (
                    <span
                      aria-label={`${item.label} — odkaz doplníme`}
                      className="flex h-11 w-11 items-center justify-center border border-line text-mute"
                    >
                      {item.icon}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-5 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] md:mt-10 md:pb-5">
          <div className="flex flex-col items-center gap-2 text-center text-[0.82rem] leading-snug text-mute sm:grid sm:grid-cols-3 sm:items-center sm:gap-6 sm:text-[0.9rem]">
            <p className="sm:justify-self-start sm:text-left">IČO: {site.ico}</p>
            <p className="sm:justify-self-center">
              {site.owner} © {year}
            </p>
            <p className="sm:justify-self-end sm:text-right">
              <a
                href={site.creditHref}
                target="_blank"
                rel="noreferrer"
                className="text-mute no-underline hover:underline"
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
