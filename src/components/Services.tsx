import { useRef } from 'react'
import { site } from '../content/site'
import { gsap, useGSAP } from '../lib/gsap'

export function Services() {
  const root = useRef<HTMLElement>(null)
  const { contextSafe } = useGSAP({ scope: root })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const photo = root.current?.querySelector<HTMLElement>('[data-service-photo]')
        const img = root.current?.querySelector<HTMLElement>('[data-service-img]')
        const wipe = root.current?.querySelector<HTMLElement>('[data-service-wipe]')

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
            { yPercent: -101, duration: 1.05, ease: 'power3.inOut' },
            0.15,
          )
        }

        if (img) {
          gsap.set(img, { scale: 1.14 })

          if (photo) {
            gsap.fromTo(
              img,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                  trigger: photo,
                  scrub: 0.7,
                  start: 'top bottom',
                  end: 'bottom top',
                },
              },
            )
          }
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
      })

      mm.add(
        '(pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const rows = gsap.utils.toArray<HTMLElement>('[data-service]')
          const cleanups: Array<() => void> = []

          rows.forEach((row) => {
            const mark = row.querySelector<HTMLElement>('[data-service-mark]')
            gsap.set(mark, { scaleY: 0 })

            const enter = contextSafe(() => {
              gsap.to(row, { x: 10, duration: 0.45, ease: 'power3.out' })
              gsap.to(mark, {
                scaleY: 1,
                duration: 0.45,
                ease: 'power3.out',
              })
            })
            const leave = contextSafe(() => {
              gsap.to(row, { x: 0, duration: 0.5, ease: 'power3.out' })
              gsap.to(mark, {
                scaleY: 0,
                duration: 0.4,
                ease: 'power3.inOut',
              })
            })

            row.addEventListener('mouseenter', enter)
            row.addEventListener('mouseleave', leave)
            cleanups.push(() => {
              row.removeEventListener('mouseenter', enter)
              row.removeEventListener('mouseleave', leave)
            })
          })

          return () => cleanups.forEach((fn) => fn())
        },
      )

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
      <div className="mx-auto grid max-w-[1120px] px-5 pb-16 pt-16 sm:pb-20 sm:pt-20 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-x-14 lg:gap-y-12 lg:pb-24 lg:pt-24 xl:gap-x-16">
        <header className="order-1 lg:col-span-2 lg:row-start-1">
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

        <figure className="relative order-2 mt-8 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:h-full">
          <div
            data-service-photo
            className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6] lg:absolute lg:inset-0 lg:aspect-auto"
          >
            <img
              data-service-img
              src={site.services.image.src}
              alt={site.services.image.alt}
              className="absolute inset-0 h-full w-full object-cover object-[center_42%] will-change-transform"
            />
            <span
              data-service-wipe
              aria-hidden
              className="absolute inset-0 z-[2] -translate-y-[101%] bg-paper"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-4 z-[1] h-8 w-8 border-l border-t border-paper/80"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-4 right-4 z-[1] h-8 w-8 border-b border-r border-paper/80"
            />
          </div>
          <figcaption className="pointer-events-none absolute bottom-4 left-4 z-[1] text-[0.72rem] font-medium uppercase tracking-[0.18em] text-paper [text-shadow:0_1px_8px_rgba(18,12,8,0.55)]">
            {site.services.image.caption}
          </figcaption>
        </figure>

        <div className="order-3 mt-8 border-b border-line lg:col-start-2 lg:row-start-2 lg:mt-0 lg:max-w-[40rem]">
          {site.services.items.map((item, index) => (
            <article
              key={item.name}
              data-service
              className="relative border-t border-line py-6 pl-5 will-change-transform sm:py-7 sm:pl-6"
            >
              <span
                data-service-mark
                aria-hidden
                className="absolute bottom-0 left-0 top-0 w-[2px] origin-top bg-wood"
              />
              <p className="text-[0.72rem] tracking-[0.18em] text-wood">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 font-serif text-[1.85rem] font-medium tracking-[-0.03em] sm:text-[2.15rem]">
                {item.name}
              </h3>
              <p className="mt-2 max-w-[38ch] text-[1.02rem] leading-relaxed text-mute">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
