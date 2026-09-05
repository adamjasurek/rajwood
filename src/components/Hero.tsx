import { useRef } from 'react'
import { HashLink } from './HashLink'
import { WoodBackdrop } from './WoodBackdrop'
import { site } from '../content/site'
import { gsap, useGSAP } from '../lib/gsap'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (window.location.hash || window.scrollY > 80) return

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.from('[data-hero-copy]', {
          y: 28,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.12,
        }).from(
          '[data-hero-photo]',
          { y: 36, autoAlpha: 0, duration: 1.05 },
          '-=0.55',
        )
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="border-b border-line">
      <div className="mx-auto grid max-w-[1120px] items-end gap-8 px-5 pb-10 pt-10 sm:pb-14 sm:pt-14 lg:grid-cols-2 lg:gap-16 lg:pb-20 lg:pt-16">
        <div>
          <p
            data-hero-copy
            className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-mute"
          >
            {site.hero.kicker}
          </p>
          <h1
            data-hero-copy
            className="whitespace-pre-line font-serif text-[2.15rem] font-medium leading-[1.12] tracking-[-0.02em] sm:text-5xl lg:text-[3.35rem]"
          >
            {site.hero.title}
          </h1>
          <p
            data-hero-copy
            className="mt-5 max-w-[36rem] text-[1.05rem] leading-relaxed text-mute"
          >
            {site.hero.subtitle}
          </p>
          <div data-hero-copy className="mt-8">
            <HashLink
              to={site.hero.ctaHref}
              className="btn-wood inline-flex h-12 items-center justify-center px-7 text-[0.95rem] font-medium tracking-wide text-paper no-underline"
            >
              <WoodBackdrop />
              <span className="relative z-[1]">{site.hero.cta}</span>
            </HashLink>
          </div>
        </div>

        <figure
          data-hero-photo
          className="flex items-end justify-center"
        >
          <img
            data-hero-img
            src={site.hero.image.src}
            alt={site.hero.image.alt}
            className="h-auto w-full max-h-64 object-contain object-bottom sm:max-h-80 lg:max-h-[32rem]"
          />
        </figure>
      </div>
    </section>
  )
}
