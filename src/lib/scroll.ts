type ScrollKind = 'auto' | 'smooth'

export const HEADER_COMPACT = 56
export const HEADER_EXPANDED_DESKTOP = 104
export const HEADER_EXPANDED_MOBILE = 72

function safeTop() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--safe-top')
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : 0
}

let scrollFrame = 0
let restoreBehavior: string | null = null
let restoreAnchor: string | null = null
let interruptBound = false

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function expandedHeaderHeight() {
  return window.matchMedia('(min-width: 768px)').matches
    ? HEADER_EXPANDED_DESKTOP
    : HEADER_EXPANDED_MOBILE
}

function headerOffset(scrollY = window.scrollY) {
  const expanded = expandedHeaderHeight()
  const enterAt = expanded - HEADER_COMPACT + 24
  const bar = scrollY > enterAt ? HEADER_COMPACT : expanded
  return bar + safeTop()
}

function targetTop(el: HTMLElement) {
  const y = el.getBoundingClientRect().top + window.scrollY
  const dest = Math.max(0, y - HEADER_COMPACT - safeTop())
  return Math.max(0, y - headerOffset(dest))
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

function bindScrollInterrupt() {
  if (interruptBound) return
  interruptBound = true

  const interrupt = () => {
    if (!scrollFrame) return
    stopAnimatedScroll()
  }

  window.addEventListener('wheel', interrupt, { passive: true })
  window.addEventListener('touchstart', interrupt, { passive: true })
  window.addEventListener('keydown', (event) => {
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'PageUp' ||
      event.key === 'PageDown' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === ' '
    ) {
      interrupt()
    }
  })
}

function animateScrollTo(top: number) {
  bindScrollInterrupt()
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

  const duration = Math.min(560, Math.max(280, Math.abs(dist) * 0.34))
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

function withInstantScroll(fn: () => void) {
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
