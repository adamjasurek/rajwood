import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HashLink } from './HashLink'
import { Logo } from './Logo'
import { WoodBackdrop } from './WoodBackdrop'
import { site } from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { isBooting } from '../lib/bootScroll'
import {
  HEADER_COMPACT,
  HEADER_EXPANDED_DESKTOP,
  HEADER_EXPANDED_MOBILE,
} from '../lib/scroll'

const MARK_RATIO = 614 / 703

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6 6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      ) : (
        <path
          d="M5 7h14M5 12h14M5 17h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      )}
    </svg>
  )
}

export function Header() {
  const root = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

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

          const expandedBar = isDesktop ? HEADER_EXPANDED_DESKTOP : HEADER_EXPANDED_MOBILE
          const compactBar = HEADER_COMPACT
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
              filter: isCompact && isDesktop ? 'blur(10px)' : 'blur(0px)',
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

          const setCompact = (next: boolean, instant = false) => {
            if (compact === next) {
              if (instant) {
                header.dataset.compact = next ? 'true' : 'false'
                tl.progress(next ? 1 : 0)
                setWord(next, true)
              }
              return
            }
            compact = next
            header.dataset.compact = next ? 'true' : 'false'
            setWord(next, instant)
            if (instant) {
              tl.progress(next ? 1 : 0)
              return
            }
            if (next) tl.play()
            else tl.reverse()
          }

          setCompact(compact, true)

          ScrollTrigger.create({
            start: leaveAt,
            end: enterAt,
            onRefresh: (self) => setCompact(self.scroll() > enterAt, true),
            onLeave: () => setCompact(true, isBooting()),
            onLeaveBack: () => setCompact(false, isBooting()),
          })
        },
      )

      return () => mm.revert()
    },
    { scope: root },
  )

  useEffect(() => {
    if (!menuOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    const html = document.documentElement
    const previous = html.style.overflow
    html.style.overflow = 'hidden'
    closeRef.current?.focus()
    window.addEventListener('keydown', onKey)

    return () => {
      html.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const close = () => setMenuOpen(false)
    mq.addEventListener('change', close)
    return () => mq.removeEventListener('change', close)
  }, [])

  return (
    <>
      <header
        ref={root}
        data-compact="false"
        className="fixed inset-x-0 top-0 z-40 bg-[#2a1810] pt-[env(safe-area-inset-top)]"
      >
        <WoodBackdrop />

        <div
          data-header-bar
          className="relative mx-auto flex h-[5.5rem] max-w-[1120px] items-center justify-between gap-3 px-5 md:h-[6.5rem] md:gap-6"
        >
          <Logo />

          <div className="flex items-center gap-2 md:gap-5">
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
              className="inline-flex h-11 min-w-11 items-center justify-center bg-paper px-3.5 text-[0.78rem] font-semibold tracking-[0.06em] text-[#2a1810] shadow-[0_8px_18px_rgba(8,4,2,0.28)] no-underline transition-colors duration-200 hover:bg-paper-2 focus-visible:outline-paper md:h-9 md:px-3.5 md:text-[0.8rem]"
            >
              <span className="md:hidden">Zavolat</span>
              <span className="hidden md:inline">{site.phone.display}</span>
            </a>

            <button
              type="button"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-paper md:hidden"
              aria-label={menuOpen ? 'Zavřít menu' : 'Otevřít menu'}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>
      <div
        aria-hidden="true"
        className="pointer-events-none h-[calc(5.5rem+env(safe-area-inset-top))] shrink-0 md:h-[calc(6.5rem+env(safe-area-inset-top))]"
      />

      {menuOpen
        ? createPortal(
            <div
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-[#2a1810] md:hidden"
            >
              <WoodBackdrop />
              <div className="relative flex h-[calc(5.5rem+env(safe-area-inset-top))] items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
                <div onClick={() => setMenuOpen(false)}>
                  <Logo />
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-paper"
                  aria-label="Zavřít menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <MenuIcon open />
                </button>
              </div>
              <nav
                className="relative flex flex-1 flex-col justify-center gap-1 px-8 pb-8"
                aria-label="Hlavní"
              >
                {site.nav.map((item) => (
                  <HashLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full py-3 font-serif text-[2.35rem] font-medium leading-tight tracking-[-0.03em] text-paper no-underline"
                  >
                    {item.label}
                  </HashLink>
                ))}
              </nav>
              <a
                href={`tel:${site.phone.tel}`}
                className="relative mx-5 mb-[max(1.25rem,env(safe-area-inset-bottom))] inline-flex h-12 items-center justify-center bg-paper text-[0.95rem] font-medium tracking-wide text-[#2a1810] no-underline"
              >
                Zavolat {site.phone.display}
              </a>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
