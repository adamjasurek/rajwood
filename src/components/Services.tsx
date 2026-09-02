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
        gsap.from('[data-fade]', {
          y: 32,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 82%',
          },
        })
      })

      mm.add(
        '(pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const cards = gsap.utils.toArray<HTMLElement>('[data-service]')
          const cleanups: Array<() => void> = []

          cards.forEach((card) => {
            const enter = contextSafe(() => {
              gsap.to(card, { y: -6, duration: 0.45, ease: 'power3.out' })
            })
            const leave = contextSafe(() => {
              gsap.to(card, { y: 0, duration: 0.5, ease: 'power3.out' })
            })

            card.addEventListener('mouseenter', enter)
            card.addEventListener('mouseleave', leave)
            cleanups.push(() => {
              card.removeEventListener('mouseenter', enter)
              card.removeEventListener('mouseleave', leave)
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
      className="border-b border-line py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1120px] px-5">
        <p
          data-fade
          className="mb-3 text-center text-[0.72rem] font-medium uppercase tracking-[0.22em] text-mute"
        >
          {site.services.kicker}
        </p>
        <h2
          data-fade
          className="mx-auto max-w-[18ch] text-center font-serif text-[2rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.5rem]"
        >
          {site.services.title}
        </h2>

        <div className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3 md:gap-5">
          {site.services.items.map((item) => (
            <article
              key={item.name}
              data-fade
              data-service
              className="border border-line bg-paper px-6 py-8 will-change-transform"
            >
              <h3 className="font-serif text-[1.65rem] font-medium tracking-[-0.02em]">
                {item.name}
              </h3>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-mute">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
