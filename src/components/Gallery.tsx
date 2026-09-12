import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  extraPhotoLabel,
  site,
  type Photo,
  type Project,
} from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { Lightbox } from './Lightbox'
import { WoodBackdrop } from './WoodBackdrop'

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
        alt={photo.alt}
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

function ProjectCard({ project }: { project: Project }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const cover = project.photos[0]
  if (!cover) return null

  return (
    <div>
      <button
        type="button"
        data-shot
        onClick={() => setLightbox(0)}
        aria-label={project.name}
        className="group block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        <span className="relative block overflow-hidden">
          <img
            src={cover.src}
            alt={cover.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
          {project.photos.length > 1 ? (
            <span
              aria-hidden="true"
              className="absolute bottom-2 right-2 bg-[rgba(18,12,8,0.62)] px-2 py-0.5 font-serif text-[0.72rem] tracking-wide text-paper"
            >
              {project.photos.length}
            </span>
          ) : null}
        </span>
        <span className="mt-2 block font-serif text-[0.98rem] font-medium leading-snug tracking-[-0.02em] sm:mt-2.5 sm:text-[1.12rem]">
          {project.name}
        </span>
      </button>
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

type GalleryProps = {
  projects: readonly Project[]
  title: string
  heading?: 'h1' | 'h2'
  sectionId?: string
  allHref?: string
  compact?: boolean
}

export function Gallery({
  projects,
  title,
  heading: TitleTag = 'h2',
  sectionId,
  allHref,
  compact = false,
}: GalleryProps) {
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
          ...(compact
            ? {}
            : {
                scrollTrigger: {
                  trigger: root.current,
                  start: 'top 82%',
                },
              }),
        })

        const shots = gsap.utils.toArray<HTMLElement>('[data-shot]')
        gsap.set(shots, { autoAlpha: 0, y: 28 })

        const revealShots = (elements: Element[]) => {
          gsap.to(elements, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.08,
            overwrite: true,
          })
        }

        ScrollTrigger.batch(shots, {
          start: 'top 90%',
          onEnter: revealShots,
          onEnterBack: revealShots,
        })

        const inView = shots.filter((el) => {
          const rect = el.getBoundingClientRect()
          return rect.bottom > 0 && rect.top < window.innerHeight * 0.95
        })
        if (inView.length) revealShots(inView)

        const delayed = gsap.delayedCall(0.12, () => {
          ScrollTrigger.refresh()
          const later = shots.filter((el) => {
            const rect = el.getBoundingClientRect()
            const hidden = getComputedStyle(el).visibility === 'hidden'
            return (
              hidden &&
              rect.height > 0 &&
              rect.bottom > 0 &&
              rect.top < window.innerHeight * 0.95
            )
          })
          if (later.length) revealShots(later)
        })

        return () => delayed.kill()
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [compact] },
  )

  return (
    <section
      ref={root}
      id={sectionId}
      className="border-b border-line py-12 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-5">
        <TitleTag
          data-fade
          className="text-balance text-center font-serif text-[1.85rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.5rem]"
        >
          {title}
        </TitleTag>

        {compact ? (
          <div className="mt-8 grid grid-cols-2 gap-x-2.5 gap-y-6 sm:mt-12 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-10 sm:mt-16 sm:gap-20">
            {projects.map((project) => (
              <ProjectPreview key={project.slug} project={project} />
            ))}
          </div>
        )}

        {allHref ? (
          <div data-fade className="mt-10 flex justify-center sm:mt-16 max-md:scroll-mb-24">
            <Link
              to={allHref}
              className="btn-wood inline-flex h-12 w-full items-center justify-center px-7 text-[0.95rem] font-medium tracking-wide text-paper no-underline sm:w-auto"
            >
              <WoodBackdrop />
              <span className="relative z-[1]">{site.gallery.allCta}</span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
