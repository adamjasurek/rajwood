import { useRef } from 'react'
import { site } from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

const photos = site.services.images

function isDesktop() {
  return window.matchMedia('(min-width: 768px)').matches
}

export function Services() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const scopeEl = root.current
        const photo = scopeEl?.querySelector<HTMLElement>('[data-service-photo]')
        const wipe = scopeEl?.querySelector<HTMLElement>('[data-service-wipe]')
        const list = scopeEl?.querySelector<HTMLElement>('[data-service-list]')
        const slides = gsap.utils.toArray<HTMLElement>('[data-service-slide]', scopeEl)
        const captions = gsap.utils.toArray<HTMLElement>('[data-service-caption]', scopeEl)

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top 78%',
          },
        })

        tl.from('[data-fade]', {
          y: 28,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.1,
        })

        const underline = scopeEl?.querySelector<SVGPathElement>(
          '[data-title-underline]',
        )
        if (underline) {
          tl.fromTo(
            underline,
            { drawSVG: 0 },
            {
              drawSVG: '100%',
              duration: 2.2,
              ease: 'power1.inOut',
            },
            0.42,
          )
        }

        if (wipe) {
          tl.fromTo(
            wipe,
            { yPercent: 0 },
            {
              yPercent: -101,
              duration: 1.05,
              ease: 'power3.inOut',
              immediateRender: false,
            },
            0.15,
          )
        }

        if (slides.length > 1 && photo) {
          gsap.set(slides.slice(1), { autoAlpha: 0 })
          gsap.set(captions.slice(1), { autoAlpha: 0 })
        }

        tl.from(
          '[data-service]',
          {
            y: 22,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.12,
          },
          '-=0.55',
        )

        const rows = gsap.utils.toArray<HTMLElement>('[data-service]', scopeEl)

        if (list && rows.length) {
          const smooth = { duration: 0.22, ease: 'power2.out' as const }
          const mark = list.querySelector<HTMLElement>('[data-service-mark]')
          if (mark) gsap.set(mark, { scaleY: 0 })
          const markTo = mark ? gsap.quickTo(mark, 'scaleY', smooth) : null
          const shiftTo = rows.map((row) => {
            const shift = row.querySelector<HTMLElement>('[data-service-shift]')
            if (!shift) return null
            return gsap.quickTo(shift, 'x', smooth)
          })

          let ranges: { start: number; end: number }[] = []
          let current = -1

          const measure = () => {
            const total = rows.reduce((sum, row) => sum + row.offsetHeight, 0)
            let acc = 0
            ranges = rows.map((row) => {
              const start = total ? acc / total : 0
              acc += row.offsetHeight
              return { start, end: total ? acc / total : 1 }
            })
          }

          const slideAt = (progress: number) => {
            if (!ranges.length || slides.length === 0) return 0
            const i = ranges.findIndex((range) => progress < range.end - 0.001)
            const row = i < 0 ? ranges.length - 1 : i
            return Math.min(row, slides.length - 1)
          }

          const fadeTo = (index: number) => {
            if (index === current) return
            const instant = current < 0
            current = index
            const fade = {
              duration: instant ? 0 : 0.28,
              ease: 'power1.out' as const,
              overwrite: true as const,
            }
            slides.forEach((slide, i) => {
              gsap.to(slide, { autoAlpha: i === index ? 1 : 0, ...fade })
            })
            captions.forEach((caption, i) => {
              gsap.to(caption, { autoAlpha: i === index ? 1 : 0, ...fade })
            })
          }

          const apply = (progress: number) => {
            markTo?.(progress)
            ranges.forEach((range, i) => {
              const span = range.end - range.start
              const amount =
                span <= 0
                  ? 0
                  : gsap.utils.clamp(0, 1, (progress - range.start) / span)
              shiftTo[i]?.(amount * 10)
            })
            if (slides.length > 1 && photo && isDesktop()) fadeTo(slideAt(progress))
          }

          ScrollTrigger.create({
            trigger: list,
            start: 'top 55%',
            end: 'bottom 55%',
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              measure()
              current = -1
              apply(self.progress)
            },
            onUpdate: (self) => apply(self.progress),
          })
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id={site.services.id}
      className="border-b border-line"
    >
      <div className="mx-auto grid max-w-[1120px] px-4 pb-14 pt-12 sm:px-5 sm:pb-20 sm:pt-20 md:grid-cols-[minmax(16rem,18rem)_minmax(0,1fr)] md:gap-x-10 md:gap-y-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-x-14 lg:pb-24 lg:pt-24 xl:gap-x-16">
        <header className="md:col-span-2 md:row-start-1">
          <h2
            data-fade
            className="text-center font-serif font-medium leading-[1.08] tracking-[-0.03em]"
          >
            <span className="block text-[clamp(1.95rem,8vw,2.35rem)] sm:text-[3.15rem] lg:text-[3.5rem]">
              {site.services.title}
            </span>
            <span className="relative mt-1 inline-block pb-[0.22em] font-serif text-[1.85rem] font-normal italic tracking-[-0.02em] text-mute sm:text-[2.35rem]">
              {site.services.titleRest}
              <svg
                aria-hidden
                className="pointer-events-none absolute left-[-4%] top-[0.92em] h-[0.5em] w-[110%] overflow-visible text-wood"
                viewBox="0 0 220 18"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  data-title-underline
                  d="M2.6 13.2 C 38 17.4, 72 6.8, 112 11.4 C 148 15.6, 178 16.2, 217.2 7.4"
                  stroke="currentColor"
                  strokeWidth="2.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
          </h2>
        </header>

        <div className="md:contents">
          <figure className="mt-6 hidden isolate md:relative md:col-start-1 md:row-start-2 md:mt-0 md:block md:h-full">
          <div
            data-service-photo
            className="relative aspect-[16/10] overflow-hidden md:absolute md:inset-0 md:aspect-auto md:h-full"
          >
            {photos.map((image, index) => (
              <div
                key={image.src}
                data-service-slide
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: index, opacity: index === 0 ? 1 : 0 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
                />
              </div>
            ))}
            <span
              data-service-wipe
              aria-hidden
              className="absolute inset-0 z-[6] -translate-y-[101%] bg-paper"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-4 z-[3] h-8 w-8 border-l border-t border-paper/80"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-4 right-4 z-[3] h-8 w-8 border-b border-r border-paper/80"
            />
            <figcaption className="pointer-events-none absolute inset-x-4 bottom-4 z-[3] h-[2.6em]">
              {photos.map((image, index) => (
                <span
                  key={image.caption}
                  data-service-caption
                  className="absolute inset-x-0 bottom-0 text-[0.68rem] font-medium uppercase leading-snug tracking-[0.12em] text-paper [text-shadow:0_1px_8px_rgba(18,12,8,0.55)] sm:text-[0.72rem] sm:tracking-[0.18em]"
                  style={{ opacity: index === 0 ? 1 : 0 }}
                >
                  {image.caption}
                </span>
              ))}
            </figcaption>
          </div>
        </figure>

        <div
          data-service-list
          className="relative mt-6 border-b border-line pb-16 md:col-start-2 md:row-start-2 md:mt-0 md:max-w-[40rem] md:pb-0"
        >
          <span
            data-service-mark
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-[2] w-[2px] origin-top bg-wood"
          />
          {site.services.items.map((item, index) => {
            const image = photos[index]
            return (
              <article
                key={item.name}
                data-service
                className="relative py-6 pl-5 before:pointer-events-none before:absolute before:inset-x-0 before:left-[2px] before:top-0 before:h-px before:bg-line sm:py-7 sm:pl-6"
              >
                <div data-service-shift className="will-change-transform">
                  {image ? (
                    <figure className="relative mb-4 aspect-[16/10] overflow-hidden md:hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-3 top-3 z-[1] h-7 w-7 border-l border-t border-paper/80"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-3 right-3 z-[1] h-7 w-7 border-b border-r border-paper/80"
                      />
                      <figcaption className="pointer-events-none absolute inset-x-3 bottom-3 z-[1] text-[0.68rem] font-medium uppercase leading-snug tracking-[0.12em] text-paper [text-shadow:0_1px_8px_rgba(18,12,8,0.55)]">
                        {image.caption}
                      </figcaption>
                    </figure>
                  ) : null}
                  <h3 className="font-serif text-[1.65rem] font-medium tracking-[-0.03em] sm:text-[2.15rem]">
                    {item.name}
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-[1.02rem] leading-relaxed text-mute">
                    {item.text}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
        </div>
      </div>
    </section>
  )
}
