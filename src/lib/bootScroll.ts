type BootWindow = Window & { __rajwoodBooted?: boolean }

let booted = false

export function isBooting() {
  return !booted
}

function waitTimeout(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function waitEagerImages(timeoutMs: number) {
  const eager = Array.from(document.images).filter((img) => img.loading !== 'lazy')
  const pending = eager
    .filter((img) => !img.complete)
    .map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        }),
    )

  if (pending.length === 0) return Promise.resolve()

  return Promise.race([Promise.all(pending).then(() => undefined), waitTimeout(timeoutMs)])
}

function waitFonts(timeoutMs: number) {
  if (!document.fonts?.ready) return Promise.resolve()
  return Promise.race([document.fonts.ready.then(() => undefined), waitTimeout(timeoutMs)])
}

export function waitFrames(count: number) {
  return new Promise<void>((resolve) => {
    const step = (left: number) => {
      if (left <= 0) {
        resolve()
        return
      }
      requestAnimationFrame(() => step(left - 1))
    }
    step(count)
  })
}

export function waitForLayout() {
  return Promise.all([waitFonts(400), waitEagerImages(800)]).then(() => waitFrames(2))
}

function lockBootScroll() {
  if (typeof window === 'undefined') return
  const w = window as BootWindow
  if (w.__rajwoodBooted) {
    booted = true
    return
  }
  window.history.scrollRestoration = 'manual'
  document.documentElement.classList.add('is-booting')
  window.scrollTo(0, 0)
}

export function unlockBootScroll() {
  if (booted) return
  booted = true
  ;(window as BootWindow).__rajwoodBooted = true
  const y = window.scrollY
  document.documentElement.classList.remove('is-booting')
  window.scrollTo(0, y)
}

lockBootScroll()
