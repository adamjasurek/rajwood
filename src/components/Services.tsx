import { useRef } from 'react'
import { site } from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { HEADER_COMPACT, safeTop } from '../lib/scroll'

const photos = site.services.images

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
          const flash = photo.querySelector<HTMLElement>('[data-service-flash]')
          if (flash) gsap.set(flash, { autoAlpha: 0 })
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
          const flash = photo?.querySelector<HTMLElement>('[data-service-flash]')

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

          const showSlide = (index: number) => {
            gsap.set(slides, { autoAlpha: (i: number) => (i === index ? 1 : 0) })
            gsap.set(captions, { autoAlpha: (i: number) => (i === index ? 1 : 0) })
          }

          const slideAt = (progress: number) => {
            if (!ranges.length || slides.length === 0) return 0
            const i = ranges.findIndex((range) => progress < range.end - 0.001)
            const row = i < 0 ? ranges.length - 1 : i
            return Math.min(row, slides.length - 1)
          }

          const cutTo = (index: number) => {
            if (index === current) return
            const first = current === -1
            current = index
            showSlide(index)
            if (first || !flash) return
            gsap.fromTo(
              flash,
              { autoAlpha: 1 },
              { autoAlpha: 0, duration: 0.16, ease: 'power1.out', overwrite: true },
            )
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
            if (slides.length > 1 && photo) cutTo(slideAt(progress))
          }

          const scanLine = () => {
            if (window.matchMedia('(min-width: 768px)').matches) return null
            return HEADER_COMPACT + safeTop() + (photo?.offsetHeight ?? 0)
          }

          ScrollTrigger.create({
            trigger: list,
            start: () => {
              const line = scanLine()
              return line == null ? 'top 55%' : `top ${line}px`
            },
            end: () => {
              const line = scanLine()
              return line == null ? 'bottom 55%' : `bottom ${line}px`
            },
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              measure()
              current = -1
              apply(self.progress)
              if (flash) gsap.set(flash, { autoAlpha: 0 })
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
      <div className="mx-auto grid max-w-[1120px] px-5 pb-16 pt-16 sm:pb-20 sm:pt-20 md:grid-cols-[minmax(16rem,18rem)_minmax(0,1fr)] md:gap-x-10 md:gap-y-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-x-14 lg:pb-24 lg:pt-24 xl:gap-x-16">
        <header className="md:col-span-2 md:row-start-1">
          <h2
            data-fade
            className="text-center font-serif font-medium leading-[1.08] tracking-[-0.03em]"
          >
            <span className="block text-[2.35rem] sm:text-[3.15rem] lg:text-[3.5rem]">
              {site.services.title}
            </span>
            <span className="mt-1 block font-serif text-[1.85rem] font-normal italic tracking-[-0.02em] text-mute sm:text-[2.35rem]">
              {site.services.titleRest}
            </span>
          </h2>
        </header>

        <div className="md:contents">
          <figure className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-[1] mt-8 isolate bg-paper shadow-[0_16px_28px_rgba(26,22,18,0.12)] md:relative md:top-auto md:z-auto md:col-start-1 md:row-start-2 md:mt-0 md:h-full md:shadow-none">
          <div
            data-service-photo
            className="relative aspect-[4/3] overflow-hidden md:absolute md:inset-0 md:aspect-auto md:h-full"
          >
            {photos.map((image, index) => (
              <div
                key={image.src}
                data-service-slide
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: index }}
              >
                <img
                  data-service-img
                  src={image.src}
                  alt={image.alt}
                  className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
                />
              </div>
            ))}
            <span
              data-service-wipe
              aria-hidden
              className="absolute inset-0 z-[2] -translate-y-[101%] bg-paper"
            />
            <span
              data-service-flash
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[4] bg-paper opacity-0"
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
              {photos.map((image) => (
                <span
                  key={image.caption}
                  data-service-caption
                  className="absolute inset-x-0 bottom-0 text-[0.72rem] font-medium uppercase leading-snug tracking-[0.18em] text-paper [text-shadow:0_1px_8px_rgba(18,12,8,0.55)]"
                >
                  {image.caption}
                </span>
              ))}
            </figcaption>
          </div>
        </figure>

        <div
          data-service-list
          className="relative mt-8 border-b border-line pb-10 md:col-start-2 md:row-start-2 md:mt-0 md:max-w-[40rem] md:pb-0"
        >
          <span
            data-service-mark
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-[2] w-[2px] origin-top bg-wood"
          />
          {site.services.items.map((item) => (
            <article
              key={item.name}
              data-service
              className="relative py-6 pl-5 before:pointer-events-none before:absolute before:inset-x-0 before:left-[2px] before:top-0 before:h-px before:bg-line sm:py-7 sm:pl-6"
            >
              <div data-service-shift className="will-change-transform">
                <h3 className="font-serif text-[1.85rem] font-medium tracking-[-0.03em] sm:text-[2.15rem]">
                  {item.name}
                </h3>
                <p className="mt-2 max-w-[38ch] text-[1.02rem] leading-relaxed text-mute">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
