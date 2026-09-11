import { useRef } from 'react'
import { site } from '../content/site'
import { gsap, SplitText, useGSAP } from '../lib/gsap'

export function Values() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (context.conditions?.reduceMotion) return

          const isDesktop = Boolean(context.conditions?.isDesktop)

          if (!isDesktop) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: root.current,
                start: 'top 90%',
              },
            })

            tl.from('[data-kicker], [data-title]', {
              y: 18,
              autoAlpha: 0,
              duration: 0.55,
              stagger: 0.08,
            })
              .from(
                '[data-beam]',
                { scaleX: 0, duration: 0.45, ease: 'power2.inOut' },
                '-=0.18',
              )
              .from(
                '[data-value]',
                {
                  y: 20,
                  autoAlpha: 0,
                  duration: 0.5,
                  stagger: 0.06,
                },
                '-=0.16',
              )
            return
          }

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
            duration: 0.5,
            stagger: 0.022,
          })
            .from(
              titleSplit.lines,
              {
                yPercent: 110,
                duration: 0.68,
                stagger: 0.08,
              },
              '+=0.18',
            )
            .from(
              '[data-beam]',
              { scaleX: 0, duration: 0.52, ease: 'power2.inOut' },
              '-=0.18',
            )
            .from(
              '[data-value]',
              {
                y: 28,
                autoAlpha: 0,
                duration: 0.56,
                stagger: 0.07,
              },
              '-=0.22',
            )
        },
      )

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id={site.values.id}
      className="border-b border-line bg-paper-2 py-12 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-5">
        <p
          data-kicker
          className="mb-3 text-center text-[0.68rem] font-medium uppercase tracking-[0.16em] text-mute sm:text-[0.72rem] sm:tracking-[0.22em]"
        >
          {site.values.kicker}
        </p>
        <h2
          data-title
          className="mx-auto max-w-[20ch] text-balance text-center font-serif text-[1.85rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.5rem]"
        >
          {site.values.title}
        </h2>
        <div
          data-beam
          aria-hidden
          className="mx-auto mt-6 h-px w-24 origin-center bg-wood sm:mt-8"
        />

        <ul className="mt-9 grid gap-x-8 gap-y-8 sm:mt-14 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          {site.values.items.map((item) => (
            <li key={item.name} data-value>
              <h3 className="font-serif text-[1.35rem] font-medium tracking-[-0.02em] sm:text-[1.45rem]">
                {item.name === 'Záruka'
                  ? `Záruka ${site.warrantyYears} let`
                  : item.name}
              </h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-mute">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
