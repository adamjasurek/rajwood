type ScrollKind = 'auto' | 'smooth'

let scrollFrame = 0
let restoreBehavior: string | null = null
let restoreAnchor: string | null = null

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function headerOffset() {
  const header = document.querySelector('header')
  return Math.round(header?.getBoundingClientRect().height ?? 72)
}

function targetTop(el: HTMLElement) {
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset())
}

function stopAnimatedScroll() {
  cancelAnimationFrame(scrollFrame)
  scrollFrame = 0
  const html = document.documentElement
  if (restoreBehavior !== null) {
    html.style.scrollBehavior = restoreBehavior
    restoreBehavior = null
  }
  if (restoreAnchor !== null) {
    html.style.overflowAnchor = restoreAnchor
    restoreAnchor = null
  }
}

function animateScrollTo(top: number) {
  stopAnimatedScroll()

  const html = document.documentElement
  restoreBehavior = html.style.scrollBehavior
  restoreAnchor = html.style.overflowAnchor
  html.style.scrollBehavior = 'auto'
  html.style.overflowAnchor = 'none'

  const start = window.scrollY
  const dist = top - start
  if (Math.abs(dist) < 1) {
    stopAnimatedScroll()
    return
  }

  const duration = Math.min(400, Math.max(180, Math.abs(dist) * 0.22))
  const t0 = performance.now()

  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration)
    const eased = 1 - (1 - p) * (1 - p)
    window.scrollTo({ top: start + dist * eased, behavior: 'auto' })
    if (p < 1) {
      scrollFrame = requestAnimationFrame(step)
      return
    }
    window.scrollTo({ top, behavior: 'auto' })
    stopAnimatedScroll()
  }

  scrollFrame = requestAnimationFrame(step)
}

export function withInstantScroll(fn: () => void) {
  stopAnimatedScroll()
  const html = document.documentElement
  const previous = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  fn()
  html.style.scrollBehavior = previous
}

export function scrollToTop(behavior: ScrollKind = 'auto') {
  if (behavior === 'smooth' && !prefersReducedMotion()) {
    animateScrollTo(0)
    return
  }

  withInstantScroll(() => {
    window.scrollTo(0, 0)
  })
}

export function scrollToHash(hash: string, behavior: ScrollKind = 'auto') {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) {
    scrollToTop(behavior)
    return
  }

  const el = document.getElementById(id)
  if (!el) return

  const top = targetTop(el)
  if (behavior === 'smooth' && !prefersReducedMotion()) {
    animateScrollTo(top)
    return
  }

  withInstantScroll(() => {
    window.scrollTo(0, top)
  })
}
