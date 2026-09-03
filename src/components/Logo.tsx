import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../content/site'
import { scrollToTop } from '../lib/scroll'

type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  const [failedLight, setFailedLight] = useState(false)
  const [failedMark, setFailedMark] = useState(false)
  const location = useLocation()

  return (
    <Link
      to="/"
      data-logo-wrap
      onClick={() => {
        if (location.pathname === '/') scrollToTop('smooth')
      }}
      className={`relative inline-block h-14 w-[6.5rem] overflow-hidden sm:h-16 sm:w-[7.8rem] ${className}`}
    >
      <img
        data-logo-light
        src={failedLight ? site.logo.fallbackSrc : site.logo.headerSrc}
        alt={site.name}
        className="absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
        onError={() => setFailedLight(true)}
      />
      <img
        data-logo-mark
        src={failedMark ? site.logo.fallbackSrc : site.logo.markSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-0"
        onError={() => setFailedMark(true)}
      />
    </Link>
  )
}
