import { useState } from 'react'
import { site } from '../content/site'

type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  const [failedLight, setFailedLight] = useState(false)
  const [failedDark, setFailedDark] = useState(false)

  return (
    <a
      href="#top"
      data-logo-wrap
      className={`relative inline-block h-14 w-[6.5rem] overflow-hidden sm:h-16 sm:w-[7.8rem] ${className}`}
    >
      <img
        data-logo-light
        src={failedLight ? site.logo.fallbackSrc : site.logo.headerSrc}
        alt={site.name}
        className="absolute left-0 top-1/2 h-full w-auto max-w-none -translate-y-1/2 object-contain object-left"
        onError={() => setFailedLight(true)}
      />
      <img
        data-logo-dark
        src={failedDark ? site.logo.fallbackSrc : site.logo.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 h-full w-auto max-w-none -translate-y-1/2 object-contain object-left opacity-0"
        onError={() => setFailedDark(true)}
      />
    </a>
  )
}
