import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { HashLink } from '../components/HashLink'
import { Lightbox } from '../components/Lightbox'
import { getProject, site } from '../content/site'
import { gsap, useGSAP } from '../lib/gsap'

const HOME_TITLE = 'RAJWOOD — Pergoly a přístřešky | Hnojník'

export function ProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  const root = useRef<HTMLElement>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    if (!project) return
    document.title = `${project.name} — ${site.name}`
    return () => {
      document.title = HOME_TITLE
    }
  }, [project])

  useGSAP(
    () => {
      if (!project) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-fade]', {
          y: 28,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.08,
        })

        gsap.set('[data-shot]', { autoAlpha: 0, y: 24 })
        gsap.to('[data-shot]', {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.07,
          delay: 0.12,
        })
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [project?.slug] },
  )

  if (!project) {
    return <Navigate to="/#realizace" replace />
  }

  return (
    <main>
      <section
        ref={root}
        className="border-b border-line py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1120px] px-5">
          <HashLink
            data-fade
            to="/#realizace"
            className="inline-flex min-h-11 items-center text-[0.72rem] font-medium uppercase tracking-[0.18em] text-wood no-underline underline-offset-4 transition-colors hover:text-wood-deep hover:underline sm:min-h-0"
          >
            {site.gallery.back}
          </HashLink>
          <h1
            data-fade
            className="mt-3 font-serif text-[2rem] font-medium leading-tight tracking-[-0.02em] sm:mt-5 sm:text-[2.5rem]"
          >
            {project.name}
          </h1>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
            {project.photos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                data-shot
                onClick={() => setLightbox(index)}
                className="group relative block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0"
                aria-label={photo.alt}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null ? (
        <Lightbox
          photos={project.photos}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </main>
  )
}
