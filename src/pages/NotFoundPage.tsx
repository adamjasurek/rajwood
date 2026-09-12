import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { WoodBackdrop } from '../components/WoodBackdrop'
import { site } from '../content/site'
import { gsap, useGSAP } from '../lib/gsap'

export function NotFoundPage() {
  const root = useRef<HTMLElement>(null)
  const page = site.notFound

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-404-copy]', {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <main className="border-b border-line">
      <section
        ref={root}
        className="mx-auto flex min-h-[min(36rem,calc(100svh-14rem))] max-w-[40rem] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[min(40rem,calc(100svh-16rem))] sm:px-5 sm:py-24"
      >
        <p
          data-404-copy
          className="font-serif text-[clamp(3.5rem,14vw,5.5rem)] font-medium leading-none tracking-[-0.04em] text-wood"
          aria-hidden="true"
        >
          {page.code}
        </p>
        <h1
          data-404-copy
          className="mt-4 text-balance font-serif text-[1.85rem] font-medium leading-tight tracking-[-0.02em] sm:mt-5 sm:text-[2.75rem]"
        >
          <span className="sr-only">{page.code}. </span>
          {page.title}
        </h1>
        <Link
          data-404-copy
          to="/"
          className="btn-wood mt-8 inline-flex h-12 w-full items-center justify-center px-7 text-[0.95rem] font-medium tracking-wide text-paper no-underline sm:mt-10 sm:w-auto"
        >
          <WoodBackdrop />
          <span className="relative z-[1]">{page.cta}</span>
        </Link>
      </section>
    </main>
  )
}
