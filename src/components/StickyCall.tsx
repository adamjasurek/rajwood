import { useEffect, useState } from 'react'
import { CallButton } from './CallButton'
import { site } from '../content/site'

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

export function StickyCall() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const update = () => setHidden(keyboardOpen())
    const vv = window.visualViewport
    update()
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    document.addEventListener('focusin', update)
    document.addEventListener('focusout', update)
    return () => {
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
      document.removeEventListener('focusin', update)
      document.removeEventListener('focusout', update)
    }
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] transition-transform duration-200 md:hidden ${
        hidden ? 'pointer-events-none translate-y-full' : ''
      }`}
    >
      <CallButton variant="bar">Zavolat {site.phone.display}</CallButton>
    </div>
  )
}
