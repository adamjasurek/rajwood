import { useRef } from 'react'
import { Logo } from './Logo'
import { site } from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

const LIGHT_RATIO = 2000 / 1090

export function Header() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const isDesktop = Boolean(context.conditions?.isDesktop)
          const reduceMotion = Boolean(context.conditions?.reduceMotion)
          const header = root.current
          if (!header) return

          const bar = header.querySelector<HTMLElement>('[data-header-bar]')
          const wrap = header.querySelector<HTMLElement>('[data-logo-wrap]')
          const light = header.querySelector<HTMLElement>('[data-logo-light]')
          const dark = header.querySelector<HTMLElement>('[data-logo-dark]')
          if (!bar || !wrap || !light || !dark) return

          gsap.set(light, { autoAlpha: 1 })
          gsap.set(dark, { autoAlpha: 0 })

          const expandedBar = isDesktop ? 104 : 88
          const compactBar = 56
          const expandedLogo = isDesktop ? 68 : 56
          const compactLogo = 36
          const duration = reduceMotion ? 0 : 0.55
          let compact = window.scrollY > 24

          const paint = (next: boolean, animate: boolean) => {
            const time = animate ? duration : 0
            const logoH = next ? compactLogo : expandedLogo
            const vars = { duration: time, ease: 'power3.inOut', overwrite: 'auto' as const }

            gsap.to(header, {
              boxShadow: next
                ? '0 10px 28px rgba(26, 22, 18, 0.34)'
                : '0 18px 40px rgba(26, 22, 18, 0.22)',
              ...vars,
            })
            gsap.to(bar, { height: next ? compactBar : expandedBar, ...vars })
            gsap.to(wrap, {
              height: logoH,
              width: logoH * LIGHT_RATIO,
              ...vars,
            })
            header.dataset.compact = next ? 'true' : 'false'
          }

          paint(compact, false)

          const apply = (next: boolean) => {
            if (next === compact) return
            compact = next
            paint(next, true)
          }

          ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => apply(self.scroll() > 24),
          })
        },
      )

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <header
      ref={root}
      data-compact="false"
      className="group/hdr sticky top-0 z-40 bg-wood-deep shadow-[0_18px_40px_rgba(26,22,18,0.22)]"
    >
      <div
        data-header-wood
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/header-wood.png')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/45 to-transparent"
      />

      <div
        data-header-bar
        className="relative mx-auto flex h-[5.5rem] max-w-[1120px] items-center justify-between px-5 md:h-[6.5rem]"
      >
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hlavní">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.92rem] text-paper/80 no-underline hover:text-paper focus-visible:outline-paper"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={`tel:${site.phone.tel}`}
          className="text-[0.92rem] font-medium tracking-wide text-paper no-underline focus-visible:outline-paper"
        >
          <span className="md:hidden">Zavolat</span>
          <span className="hidden md:inline">{site.phone.display}</span>
        </a>
      </div>
    </header>
  )
}
