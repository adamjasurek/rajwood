import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { StickyCall } from './StickyCall'
import { site } from '../content/site'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { unlockBootScroll, waitForLayout, waitFrames } from '../lib/bootScroll'
import { scrollToHash, scrollToTop } from '../lib/scroll'

function settle(hash: string) {
  if (hash) scrollToHash(hash, 'auto')
  else scrollToTop('auto')
  ScrollTrigger.refresh()
  if (hash) scrollToHash(hash, 'auto')
  ScrollTrigger.refresh()
}

export function Layout() {
  const page = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const prevPathname = useRef<string | null>(null)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const legal = Object.values(site.legal).find(
      (item) => item.path === location.pathname,
    )
    if (legal) {
      document.title = `${legal.title} — ${site.name}`
      return
    }
    if (location.pathname === site.gallery.path) {
      document.title = `${site.gallery.pageTitle} — ${site.name}`
      return
    }
    document.title = site.documentTitle
  }, [location.pathname])

  useLayoutEffect(() => {
    const pathChanged = prevPathname.current !== location.pathname
    const isFirst = prevPathname.current === null
    prevPathname.current = location.pathname

    if (isFirst || !pathChanged) return

    settle(isHome ? location.hash : '')
  }, [isHome, location.pathname, location.hash])

  useGSAP(
    () => {
      const hash = isHome ? location.hash : ''
      let cancelled = false
      let done = false

      const finish = async () => {
        if (cancelled || done) return
        done = true
        settle(hash)
        await waitFrames(2)
        if (cancelled) return
        unlockBootScroll()
        settle(hash)
      }

      const failSafe = window.setTimeout(() => {
        void finish()
      }, 2500)

      waitForLayout().then(() => {
        window.clearTimeout(failSafe)
        void finish()
      })

      return () => {
        cancelled = true
        window.clearTimeout(failSafe)
      }
    },
    { scope: page, dependencies: [location.pathname, isHome] },
  )

  return (
    <div ref={page} id="top">
      <Header />
      <Outlet />
      <Footer />
      <StickyCall />
    </div>
  )
}
