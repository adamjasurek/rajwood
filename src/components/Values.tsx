import { useRef, type ReactNode } from 'react'
import { site } from '../content/site'
import { gsap, SplitText, useGSAP } from '../lib/gsap'

function IconSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-28 w-28 sm:h-36 sm:w-36 lg:h-40 lg:w-40"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

function ClockIcon() {
  return (
    <IconSvg>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </IconSvg>
  )
}

function HandshakeIcon() {
  return (
    <IconSvg>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </IconSvg>
  )
}

function HammerIcon() {
  return (
    <IconSvg>
      <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" />
      <path d="m18 15 4-4" />
      <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
    </IconSvg>
  )
}

const valueIcons = {
  clock: ClockIcon,
  handshake: HandshakeIcon,
  hammer: HammerIcon,
} as const

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

        <ul className="mt-9 grid gap-x-8 gap-y-10 sm:mt-14 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
          {site.values.items.map((item) => {
            const Icon = valueIcons[item.icon as keyof typeof valueIcons]
            return (
              <li
                key={item.name}
                data-value
                className="relative min-h-[8.75rem] overflow-hidden py-2 sm:min-h-[10rem]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-wood opacity-[0.13]"
                >
                  <Icon />
                </span>
                <h3 className="relative font-serif text-[1.35rem] font-medium tracking-[-0.02em] sm:text-[1.45rem]">
                  {item.name}
                </h3>
                <p className="relative mt-3 pr-[7.75rem] text-[1.02rem] leading-relaxed text-mute sm:pr-[10rem] lg:pr-[11rem]">
                  {item.text}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
