import { useRef } from 'react'
import { site } from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

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

        ScrollTrigger.batch('[data-shot]', {
          start: 'top 90%',
          onEnter: (elements) => {
            gsap.to(elements, {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.08,
              overwrite: true,
            })
          },
        })
      })

      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.utils.toArray<HTMLElement>('[data-shot-img]').forEach((img) => {
            gsap.fromTo(
              img,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                  trigger: img.parentElement,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1,
                },
              },
            )
          })
        },
      )

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
            <div key={project.name}>
              <h3
                data-fade
                className="mb-5 font-serif text-[1.65rem] font-medium tracking-[-0.02em] sm:mb-7 sm:text-[1.85rem]"
              >
                {project.name}
              </h3>
              <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
                {project.photos.map((photo) => (
                  <figure
                    key={photo.src}
                    data-shot
                    className="mb-3 break-inside-avoid sm:mb-4"
                  >
                    <div className="overflow-hidden">
                      <img
                        data-shot-img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        className="aspect-[4/5] max-h-52 w-full object-cover will-change-transform sm:max-h-none sm:aspect-auto"
                      />
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
