import { useRef, useState } from 'react'
import {
  extraPhotoLabel,
  site,
  type Photo,
  type Project,
} from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { Lightbox } from './Lightbox'

const PREVIEW_COUNT = 2

function PhotoButton({
  photo,
  onOpen,
  overlay,
  label,
  extra,
  className = '',
  imgClassName = 'aspect-[4/5]',
}: {
  photo: Photo
  onOpen: () => void
  overlay?: string
  label: string
  extra?: boolean
  className?: string
  imgClassName?: string
}) {
  return (
    <button
      type="button"
      data-shot
      data-extra={extra ? '' : undefined}
      onClick={onOpen}
      aria-label={label}
      aria-expanded={overlay ? false : undefined}
      className={`group relative block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left ${className}`}
    >
      <img
        src={photo.src}
        alt=""
        loading="lazy"
        decoding="async"
        className={`w-full object-cover transition-[filter,transform] duration-500 ${imgClassName} ${
          overlay ? 'scale-110 blur-[8px]' : ''
        }`}
      />
      {overlay ? (
        <span className="absolute inset-0 flex items-center justify-center bg-[rgba(18,12,8,0.48)]">
        <span className="font-serif text-[1.05rem] font-medium tracking-[-0.02em] text-paper sm:text-[1.45rem]">
            {overlay}
          </span>
        </span>
      ) : (
        <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
      )}
    </button>
  )
}

function ProjectPreview({ project }: { project: Project }) {
  const grid = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const hasMore = project.photos.length > PREVIEW_COUNT
  const extraCount = project.photos.length - PREVIEW_COUNT
  const extraLabel = hasMore ? extraPhotoLabel(extraCount) : ''
  const photos =
    expanded || !hasMore
      ? project.photos
      : project.photos.slice(0, PREVIEW_COUNT + 1)

  useGSAP(
    () => {
      if (!expanded) return

      const extras = gsap.utils.toArray<HTMLElement>('[data-extra]')
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!extras.length) return
        gsap.from(extras, {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.07,
        })
      })

      ScrollTrigger.refresh()
      return () => mm.revert()
    },
    { scope: grid, dependencies: [expanded] },
  )

  return (
    <div>
      <h3
        data-fade
        className="mb-4 font-serif text-[1.4rem] font-medium leading-snug tracking-[-0.02em] sm:mb-7 sm:text-[1.85rem]"
      >
        {project.name}
      </h3>

      <div
        ref={grid}
        className={`grid gap-2 sm:gap-3 lg:gap-4 ${
          hasMore ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {photos.map((photo, index) => {
          const isTeaser = hasMore && !expanded && index === PREVIEW_COUNT

          return (
            <PhotoButton
              key={photo.src}
              photo={photo}
              extra={expanded && index > PREVIEW_COUNT}
              overlay={isTeaser ? extraLabel : undefined}
              label={isTeaser ? `${extraLabel}, ${project.name}` : photo.alt}
              onOpen={() =>
                isTeaser ? setExpanded(true) : setLightbox(index)
              }
              className={
                hasMore && index === 0 ? 'col-span-2 md:col-span-1' : undefined
              }
              imgClassName={
                hasMore && index === 0
                  ? 'aspect-[4/3] md:aspect-[4/5]'
                  : 'aspect-[4/5]'
              }
            />
          )
        })}
      </div>

      {lightbox !== null ? (
        <Lightbox
          photos={project.photos}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </div>
  )
}

export function Gallery() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-fade]', {
          y: 28,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.08,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 82%',
          },
        })

        gsap.set('[data-shot]', { autoAlpha: 0, y: 28 })

        const revealShots = (elements: Element[]) => {
          gsap.to(elements, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.08,
            overwrite: true,
          })
        }

        ScrollTrigger.batch('[data-shot]', {
          start: 'top 90%',
          onEnter: revealShots,
          onEnterBack: revealShots,
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id={site.gallery.id}
      className="border-b border-line py-12 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-5">
        <h2
          data-fade
          className="text-balance text-center font-serif text-[1.85rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.5rem]"
        >
          {site.gallery.title}
        </h2>

        <div className="mt-8 flex flex-col gap-10 sm:mt-16 sm:gap-20">
          {site.gallery.projects.map((project) => (
            <ProjectPreview key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
