import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { site, type Photo } from '../content/site'

type LightboxProps = {
  photos: readonly Photo[]
  startIndex: number
  onClose: () => void
}

export function Lightbox({ photos, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)
  const photo = photos[index]
  const copy = site.gallery.lightbox

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((current) => (current + dir + photos.length) % photos.length)
    },
    [photos.length],
  )

  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') go(-1)
      if (event.key === 'ArrowRight') go(1)
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [go, onClose])

  if (!photo) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#100c09]"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={copy.close}
        className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex h-12 w-12 cursor-pointer items-center justify-center text-paper transition-opacity hover:opacity-70 focus-visible:outline-paper sm:right-6 sm:top-6 sm:h-11 sm:w-11"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6 6 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </button>

      {photos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              go(-1)
            }}
            aria-label={copy.prev}
            className="absolute left-1 z-10 flex h-12 w-12 cursor-pointer items-center justify-center text-paper transition-opacity hover:opacity-70 focus-visible:outline-paper sm:left-4 sm:h-14 sm:w-14"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
              <path
                d="M15 5 8 12l7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              go(1)
            }}
            aria-label={copy.next}
            className="absolute right-1 z-10 flex h-12 w-12 cursor-pointer items-center justify-center text-paper transition-opacity hover:opacity-70 focus-visible:outline-paper sm:right-4 sm:h-14 sm:w-14"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </>
      ) : null}

      <figure
        className="flex max-h-[100svh] max-w-[100vw] flex-col items-center px-4 py-20 sm:px-20 sm:py-16"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchX.current = event.changedTouches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          const start = touchX.current
          const end = event.changedTouches[0]?.clientX
          touchX.current = null
          if (start == null || end == null) return
          const delta = end - start
          if (delta > 50) go(-1)
          if (delta < -50) go(1)
        }}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[min(78svh,900px)] w-auto max-w-full object-contain"
        />
        <figcaption className="mt-4 text-center text-[0.78rem] tracking-[0.16em] text-paper/70">
          {index + 1} / {photos.length}
        </figcaption>
      </figure>
    </div>,
    document.body,
  )
}
