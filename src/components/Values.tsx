import { useRef } from 'react'
import { site } from '../content/site'
import { gsap, SplitText, useGSAP } from '../lib/gsap'

export function Values() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const kicker = root.current?.querySelector<HTMLElement>('[data-kicker]')
        const title = root.current?.querySelector<HTMLElement>('[data-title]')
        if (!kicker || !title) return

        const kickerSplit = SplitText.create(kicker, {
          type: 'chars',
          mask: 'chars',
          smartWrap: true,
        })
        const titleSplit = SplitText.create(title, {
          type: 'words,lines',
          mask: 'lines',
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 90%',
          },
        })

        tl.from(kickerSplit.chars, {
          yPercent: 115,
          duration: 0.7,
          stagger: 0.032,
        })
          .from(
            titleSplit.lines,
            {
              yPercent: 110,
              duration: 0.95,
              stagger: 0.12,
            },
            '+=0.38',
          )
          .from(
            '[data-beam]',
            { scaleX: 0, duration: 0.75, ease: 'power2.inOut' },
            '-=0.2',
          )
          .from(
            '[data-value]',
            {
              y: 28,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.1,
            },
            '-=0.25',
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
      className="border-b border-line bg-paper-2 py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1120px] px-5">
        <p
          data-kicker
          className="mb-3 text-center text-[0.72rem] font-medium uppercase tracking-[0.22em] text-mute"
        >
          {site.values.kicker}
        </p>
        <h2
          data-title
          className="mx-auto max-w-[20ch] text-center font-serif text-[2rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.5rem]"
        >
          {site.values.title}
        </h2>
        <div
          data-beam
          aria-hidden
          className="mx-auto mt-7 h-px w-24 origin-center bg-wood sm:mt-8"
        />

        <ol className="mt-10 grid gap-x-8 gap-y-9 sm:mt-14 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
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
