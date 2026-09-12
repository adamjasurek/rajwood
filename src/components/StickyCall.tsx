import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CallButton } from './CallButton'
import { site } from '../content/site'

const STICKY_RESERVE = 96

function keyboardOpen() {
  const vv = window.visualViewport
  const covered = vv ? window.innerHeight - vv.height > 72 : false
  const el = document.activeElement
  const typing =
    el instanceof HTMLElement &&
    (el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.tagName === 'SELECT')
  return covered || typing
}

function shouldHide() {
  if (keyboardOpen()) return true
  const view = window.innerHeight
  for (const el of document.querySelectorAll('.btn-wood, [data-sticky-hide]')) {
    const rect = el.getBoundingClientRect()
    if (rect.bottom > 0 && rect.top < view && rect.height > 0) return true
  }
  return false
}

export function StickyCall() {
  const [hidden, setHidden] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const update = () => setHidden(shouldHide())
    const vv = window.visualViewport
    const io = new IntersectionObserver(update, {
      rootMargin: `0px 0px -${STICKY_RESERVE}px 0px`,
      threshold: [0, 0.01, 1],
    })

    const observe = () => {
      io.disconnect()
      document.querySelectorAll('.btn-wood, [data-sticky-hide]').forEach((el) => io.observe(el))
      update()
    }

    observe()
    const frame = window.requestAnimationFrame(observe)
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    document.addEventListener('focusin', update)
    document.addEventListener('focusout', update)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.cancelAnimationFrame(frame)
      io.disconnect()
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
      document.removeEventListener('focusin', update)
      document.removeEventListener('focusout', update)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [location.pathname, location.hash])

  return (
    <div
      data-sticky-call
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] transition-transform duration-200 md:hidden ${
        hidden ? 'pointer-events-none translate-y-full' : ''
      }`}
      aria-hidden={hidden}
      inert={hidden}
    >
      <CallButton>Zavolat {site.phone.display}</CallButton>
    </div>
  )
}
