import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../content/site'
import { scrollToTop } from '../lib/scroll'

type LogoProps = {
  className?: string
}

const LOGO_FULL_H = 916
const LOGO_WORD_TOP = 735
const LOGO_WORD_H = LOGO_FULL_H - LOGO_WORD_TOP

export function Logo({ className = '' }: LogoProps) {
  const [failedMark, setFailedMark] = useState(false)
  const [failedWord, setFailedWord] = useState(false)
  const location = useLocation()

  return (
    <Link
      to="/"
      data-logo-wrap
      onClick={() => {
        if (location.pathname === '/') scrollToTop('smooth')
      }}
      className={`relative flex h-14 w-[6.5rem] flex-col items-center overflow-hidden md:h-[4.75rem] md:w-[8.75rem] ${className}`}
    >
      <img
        data-logo-mark
        src={failedMark ? site.logo.fallbackSrc : site.logo.markSrc}
        alt={site.name}
        className="relative z-[1] h-10 w-auto max-w-none shrink-0 object-contain md:h-14"
        onError={() => setFailedMark(true)}
      />
      <span
        data-logo-word-clip
        className="relative h-4 w-full shrink-0 overflow-hidden md:h-5"
      >
        <img
          data-logo-word
          src={failedWord ? site.logo.fallbackSrc : site.logo.headerSrc}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 max-w-none -translate-x-1/2"
          style={{
            height: `${(LOGO_FULL_H / LOGO_WORD_H) * 100}%`,
            top: `${-(LOGO_WORD_TOP / LOGO_WORD_H) * 100}%`,
          }}
          onError={() => setFailedWord(true)}
        />
      </span>
    </Link>
  )
}
