import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  extraPhotoLabel,
  projectPath,
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
}: {
  photo: Photo
  onOpen: () => void
  overlay?: string
  label: string
}) {
  return (
    <button
      type="button"
      data-shot
      onClick={onOpen}
      aria-label={label}
      className="group relative block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left"
    >
      <img
        src={photo.src}
        alt=""
        loading="lazy"
        className={`aspect-[4/5] w-full object-cover ${
          overlay ? 'scale-110 blur-[8px]' : ''
        }`}
      />
      {overlay ? (
        <span className="absolute inset-0 flex items-center justify-center bg-[rgba(18,12,8,0.48)]">
          <span className="font-serif text-[1.15rem] font-medium tracking-[-0.02em] text-paper sm:text-[1.45rem]">
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
  const [lightbox, setLightbox] = useState<number | null>(null)
  const preview = project.photos.slice(0, PREVIEW_COUNT)
  const teaser = project.photos[PREVIEW_COUNT]
  const extraCount = project.photos.length - PREVIEW_COUNT
  const extraLabel = extraCount > 0 ? extraPhotoLabel(extraCount) : ''

  return (
    <div>
      <div
        data-fade
        className="mb-5 flex items-start justify-between gap-4 sm:mb-7"
      >
        <h3 className="font-serif text-[1.65rem] font-medium tracking-[-0.02em] sm:text-[1.85rem]">
          {project.name}
        </h3>
        <Link
          to={projectPath(project.slug)}
          className="mt-1 shrink-0 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-wood no-underline underline-offset-4 transition-colors hover:text-wood-deep hover:underline sm:mt-2 sm:text-[0.78rem]"
        >
          {site.gallery.showMore}
        </Link>
      </div>

      <div
        className={`grid gap-2 sm:gap-3 lg:gap-4 ${
          teaser ? 'grid-cols-3' : 'grid-cols-2'
        }`}
      >
        {preview.map((photo, index) => (
          <PhotoButton
            key={photo.src}
            photo={photo}
            label={photo.alt}
            onOpen={() => setLightbox(index)}
          />
        ))}
        {teaser ? (
          <PhotoButton
            photo={teaser}
            overlay={extraLabel}
            label={`${extraLabel}, ${project.name}`}
            onOpen={() => setLightbox(PREVIEW_COUNT)}
          />
        ) : null}
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
      className="border-b border-line py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1120px] px-5">
        <p
          data-fade
          className="mb-3 text-center text-[0.72rem] font-medium uppercase tracking-[0.22em] text-mute"
        >
          {site.gallery.kicker}
        </p>
        <h2
          data-fade
          className="text-center font-serif text-[2rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.5rem]"
        >
          {site.gallery.title}
        </h2>

        <div className="mt-12 flex flex-col gap-14 sm:mt-16 sm:gap-20">
          {site.gallery.projects.map((project) => (
            <ProjectPreview key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
