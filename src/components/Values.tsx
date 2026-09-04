import { useRef } from 'react'
import { site } from '../content/site'
import { gsap, useGSAP } from '../lib/gsap'

export function Values() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 82%',
          },
        })

        tl.from('[data-fade]', {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.1,
        })
          .from(
            '[data-beam]',
            { scaleX: 0, duration: 0.75, ease: 'power2.inOut' },
            '-=0.15',
          )
          .from(
            '[data-value]',
            {
              y: 28,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.1,
            },
            '-=0.2',
          )
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id={site.values.id}
      className="border-b border-line bg-paper-2 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1120px] px-5">
        <p
          data-fade
          className="mb-3 text-center text-[0.72rem] font-medium uppercase tracking-[0.22em] text-mute"
        >
          {site.values.kicker}
        </p>
        <h2
          data-fade
          className="mx-auto max-w-[20ch] text-center font-serif text-[2rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.5rem]"
        >
          {site.values.title}
        </h2>
        <div
          data-beam
          aria-hidden
          className="mx-auto mt-7 h-px w-24 origin-center bg-wood sm:mt-8"
        />

        <ol className="mt-10 grid gap-x-8 gap-y-10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {site.values.items.map((item) => (
            <li key={item.num} data-value>
              <p className="text-[0.72rem] tracking-[0.18em] text-wood">
                {item.num}
              </p>
              <h3 className="mt-3 font-serif text-[1.45rem] font-medium tracking-[-0.02em]">
                {item.num === '04'
                  ? `Záruka ${site.warrantyYears} let`
                  : item.name}
              </h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-mute">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
