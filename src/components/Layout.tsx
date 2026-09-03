import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { StickyCall } from './StickyCall'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { scrollToHash, scrollToTop } from '../lib/scroll'

export function Layout() {
  const page = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const prevPathname = useRef<string | null>(null)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useLayoutEffect(() => {
    const pathChanged = prevPathname.current !== location.pathname
    const isFirst = prevPathname.current === null
    prevPathname.current = location.pathname

    if (isHome && location.hash) {
      if (isFirst || pathChanged) {
        scrollToHash(location.hash)
      }
      return
    }

    if (isFirst || pathChanged) {
      scrollToTop()
    }
  }, [isHome, location.pathname, location.hash])

  useEffect(() => {
    ScrollTrigger.refresh()
    if (!isHome) scrollToTop()
  }, [isHome, location.pathname])

  useGSAP(
    () => {
      const images = Array.from(document.images)
      const pending = images.filter((img) => !img.complete)

      const finish = () => {
        ScrollTrigger.refresh()
        if (!isHome) scrollToTop()
        else if (location.hash) scrollToHash(location.hash)
      }

      if (pending.length === 0) {
        finish()
        return
      }

      let left = pending.length
      const done = () => {
        left -= 1
        if (left <= 0) finish()
      }

      pending.forEach((img) => {
        img.addEventListener('load', done, { once: true })
        img.addEventListener('error', done, { once: true })
      })
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
