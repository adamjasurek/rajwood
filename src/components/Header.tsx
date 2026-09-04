import { useRef } from 'react'
import { HashLink } from './HashLink'
import { Logo } from './Logo'
import { site } from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

const MARK_RATIO = 614 / 703

function WoodBackdrop() {
  return (
    <div data-header-wood className="header-wood" aria-hidden="true">
      <div className="header-wood__photo" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.18] mix-blend-overlay">
        <filter
          id="rajwood-header-grain"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.12"
            numOctaves="3"
            seed="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#rajwood-header-grain)"
        />
      </svg>
      <div className="header-wood__read" />
      <div className="header-wood__edge" />
    </div>
  )
}

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
          const mark = header.querySelector<HTMLElement>('[data-logo-mark]')
          const wordClip = header.querySelector<HTMLElement>('[data-logo-word-clip]')
          if (!bar || !wrap || !mark || !wordClip) return

          const expandedBar = isDesktop ? 104 : 88
          const compactBar = 56
          const compactLogo = 36
          const heightDelta = expandedBar - compactBar
          const enterAt = heightDelta + 24
          const leaveAt = 8
          const duration = reduceMotion ? 0 : 0.65
          const fade = reduceMotion ? 0 : 1.05

          const setWord = (isCompact: boolean, instant = false) => {
            gsap.to(wordClip, {
              autoAlpha: isCompact ? 0 : 1,
              y: isCompact ? -12 : 0,
              filter: isCompact ? 'blur(10px)' : 'blur(0px)',
              duration: instant ? 0 : fade,
              ease: isCompact ? 'power2.in' : 'power2.out',
              overwrite: 'auto',
            })
          }

          gsap.set(mark, { autoAlpha: 1 })
          gsap.set(wordClip, { y: 0, filter: 'blur(0px)' })

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power2.out' },
          })

          tl.to(bar, { height: compactBar, duration }, 0)
            .to(
              wrap,
              {
                height: compactLogo,
                width: compactLogo * MARK_RATIO,
                duration,
              },
              0,
            )
            .to(mark, { height: compactLogo, duration }, 0)
            .to(wordClip, { height: 0, duration }, 0)
            .to(
              header,
              { boxShadow: '0 10px 28px rgba(26, 22, 18, 0.34)', duration },
              0,
            )

          let compact = window.scrollY > enterAt
          tl.progress(compact ? 1 : 0)
          header.dataset.compact = compact ? 'true' : 'false'
          setWord(compact, true)

          ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
              const y = self.scroll()
              if (!compact && y > enterAt) {
                compact = true
                header.dataset.compact = 'true'
                setWord(true)
                tl.play()
              } else if (compact && y < leaveAt) {
                compact = false
                header.dataset.compact = 'false'
                setWord(false)
                tl.reverse()
              }
            },
          })
        },
      )

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <>
      <header
        ref={root}
        data-compact="false"
        className="group/hdr fixed inset-x-0 top-0 z-40 bg-[#2a1810]"
      >
        <WoodBackdrop />

        <div
          data-header-bar
          className="relative mx-auto flex h-[5.5rem] max-w-[1120px] items-center justify-between gap-6 px-5 md:h-[6.5rem]"
        >
          <Logo />

          <div className="flex items-center gap-3 md:gap-5">
            <nav
              className="header-nav hidden items-center gap-6 md:flex lg:gap-7"
              aria-label="Hlavní"
            >
              {site.nav.map((item) => (
                <HashLink
                  key={item.href}
                  to={item.href}
                  className="header-nav__link relative py-1 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-paper no-underline focus-visible:outline-paper lg:text-[0.82rem] lg:tracking-[0.16em]"
                >
                  {item.label}
                </HashLink>
              ))}
            </nav>

            <a
              href={`tel:${site.phone.tel}`}
              className="inline-flex h-8 items-center bg-paper px-3 text-[0.75rem] font-semibold tracking-[0.06em] text-[#2a1810] shadow-[0_8px_18px_rgba(8,4,2,0.28)] no-underline transition-colors duration-200 hover:bg-paper-2 focus-visible:outline-paper md:h-9 md:px-3.5 md:text-[0.8rem]"
            >
              <span className="md:hidden">Zavolat</span>
              <span className="hidden md:inline">{site.phone.display}</span>
            </a>
          </div>
        </div>
      </header>
      <div
        aria-hidden="true"
        className="pointer-events-none h-[5.5rem] shrink-0 md:h-[6.5rem]"
      />
    </>
  )
}
