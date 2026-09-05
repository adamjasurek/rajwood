import { useId } from 'react'

type WoodBackdropProps = {
  className?: string
}

export function WoodBackdrop({ className = 'header-wood' }: WoodBackdropProps) {
  const grainId = `wood-grain-${useId().replace(/:/g, '')}`

  return (
    <div data-wood-backdrop className={className} aria-hidden="true">
      <div className="header-wood__photo" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.18] mix-blend-overlay">
        <filter
          id={grainId}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.12"
            numOctaves="3"
            seed="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
      <div className="header-wood__read" />
      <div className="header-wood__edge" />
    </div>
  )
}
