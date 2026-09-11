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
  const line =
    'block h-[1.6px] w-3.5 bg-current transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

  return (
    <span className="flex h-6 w-6 flex-col items-center justify-center gap-[3.4px]" aria-hidden="true">
      <span className={`${line} ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
      <span className={`${line} ${open ? 'opacity-0' : ''}`} />
      <span className={`${line} ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
    </span>
  )
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Header() {
  const root = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const menuTl = useRef<gsap.core.Timeline | null>(null)
  const menuOpenRef = useRef(false)
  const showHeader = useRef<(instant?: boolean) => void>(() => {})
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const menuId = useId()
  menuOpenRef.current = menuOpen

  const openMenu = () => {
    showHeader.current(true)
    setMenuMounted(true)
    setMenuOpen(true)
  }

  const closeMenu = () => {
    setMenuOpen(false)
    if (prefersReducedMotion() || window.matchMedia('(min-width: 768px)').matches) {
      setMenuMounted(false)
    }
  }

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
          const hideAfter = expandedBar + 48
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

          if (!isDesktop) {
            const hideTween = gsap.to(header, {
              yPercent: -100,
              paused: true,
              duration: reduceMotion ? 0 : 0.32,
              ease: 'power2.out',
            })

            let revealed = true
            const setRevealed = (next: boolean, instant = false) => {
              if (menuOpenRef.current) next = true
              if (revealed === next) {
                if (instant) hideTween.progress(next ? 0 : 1)
                return
              }
              revealed = next
              header.dataset.revealed = next ? 'true' : 'false'
              if (instant || reduceMotion) {
                hideTween.progress(next ? 0 : 1)
                return
              }
              if (next) hideTween.reverse()
              else hideTween.play()
            }

            header.dataset.revealed = 'true'
            showHeader.current = (instant = false) => setRevealed(true, instant)

            ScrollTrigger.create({
              start: 0,
              end: 'max',
              onRefresh: (self) => {
                if (self.scroll() <= hideAfter) setRevealed(true, true)
              },
              onUpdate: (self) => {
                if (isBooting() || menuOpenRef.current) {
                  setRevealed(true, isBooting())
                  return
                }
                if (self.scroll() <= hideAfter) {
                  setRevealed(true)
                  return
                }
                setRevealed(self.direction === -1)
              },
            })
          }
        },
      )

      return () => {
        showHeader.current = () => {}
        mm.revert()
      }
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!menuMounted || !menuRef.current) return

      const panel = menuRef.current
      const links = gsap.utils.toArray<HTMLElement>('[data-menu-link]', panel)
      const call = panel.querySelector<HTMLElement>('[data-menu-call]')

      if (prefersReducedMotion()) {
        gsap.set(panel, { clipPath: 'none', autoAlpha: 1 })
        gsap.set(links, { autoAlpha: 1, y: 0 })
        if (call) gsap.set(call, { autoAlpha: 1, y: 0 })
        menuTl.current = null
        return
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onReverseComplete: () => setMenuMounted(false),
      })

      gsap.set(panel, { clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 1 })
      gsap.set(links, { autoAlpha: 0, y: 28 })
      if (call) gsap.set(call, { autoAlpha: 0, y: 16 })

      tl.to(
        panel,
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.inOut' },
        0,
      )
        .to(
          links,
          { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.045 },
          0.2,
        )

      if (call) {
        tl.to(call, { autoAlpha: 1, y: 0, duration: 0.34 }, 0.32)
      }

      menuTl.current = tl
      tl.play()

      return () => {
        tl.kill()
        menuTl.current = null
      }
    },
    { dependencies: [menuMounted], scope: menuRef },
  )

  useGSAP(
    () => {
      if (!menuMounted) return
      const tl = menuTl.current
      if (!tl) return
      if (menuOpen) tl.play()
      else tl.reverse()
    },
    { dependencies: [menuOpen, menuMounted] },
  )

  useEffect(() => {
    if (!menuMounted) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuMounted])

  useEffect(() => {
    if (!menuOpen) return

    const html = document.documentElement
    const previous = html.style.overflow
    html.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      html.style.overflow = previous
    }
  }, [menuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const close = () => closeMenu()
    mq.addEventListener('change', close)
    return () => mq.removeEventListener('change', close)
  }, [])

  return (
    <>
      <header
        ref={root}
        data-compact="false"
        data-revealed="true"
        className="fixed inset-x-0 top-0 z-40 bg-[#2a1810] pt-[env(safe-area-inset-top)]"
      >
        <WoodBackdrop />

        <div
          data-header-bar
          className="relative mx-auto flex h-[4.5rem] max-w-[1120px] items-center justify-between gap-3 px-4 md:h-[6.5rem] md:gap-6 md:px-5"
        >
          <Logo />

          <div className="flex items-center gap-1.5 md:gap-5">
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
              className="hidden h-9 min-w-11 items-center justify-center bg-paper px-3.5 text-[0.8rem] font-semibold tracking-[0.06em] text-[#2a1810] shadow-[0_8px_18px_rgba(8,4,2,0.28)] no-underline transition-colors duration-200 hover:bg-paper-2 focus-visible:outline-paper md:inline-flex"
            >
              {site.phone.display}
            </a>

            <button
              type="button"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-paper md:hidden"
              aria-label={menuOpen ? 'Zavřít menu' : 'Otevřít menu'}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>
      <div
        aria-hidden="true"
        className="pointer-events-none h-[calc(4.5rem+env(safe-area-inset-top))] shrink-0 md:h-[calc(6.5rem+env(safe-area-inset-top))]"
      />

      {menuMounted
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className={`fixed inset-0 z-[70] overflow-hidden bg-[#2a1810] md:hidden ${
                menuOpen ? '' : 'pointer-events-none'
              }`}
            >
              <WoodBackdrop />
              <div className="relative flex h-full flex-col overflow-y-auto overscroll-contain">
              <div className="relative flex h-[calc(4.5rem+env(safe-area-inset-top))] items-center justify-between px-4 pt-[env(safe-area-inset-top)] md:px-5">
                <div onClick={closeMenu}>
                  <Logo />
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-paper"
                  aria-label="Zavřít menu"
                  onClick={closeMenu}
                >
                  <MenuIcon open />
                </button>
              </div>
              <nav
                className="relative flex flex-1 flex-col justify-center gap-0.5 px-6 pb-6 min-[400px]:px-8"
                aria-label="Hlavní"
              >
                {site.nav.map((item) => (
                  <HashLink
                    key={item.href}
                    to={item.href}
                    data-menu-link
                    onClick={closeMenu}
                    className="flex min-h-12 w-full items-center py-2 font-serif text-[clamp(1.85rem,8vw,2.35rem)] font-medium leading-tight tracking-[-0.03em] text-paper no-underline"
                  >
                    {item.label}
                  </HashLink>
                ))}
              </nav>
              <a
                href={`tel:${site.phone.tel}`}
                data-menu-call
                className="relative mx-4 mb-[max(1.25rem,env(safe-area-inset-bottom))] inline-flex h-12 items-center justify-center bg-paper text-[0.95rem] font-medium tracking-wide text-[#2a1810] no-underline min-[400px]:mx-5"
              >
                Zavolat {site.phone.display}
              </a>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
