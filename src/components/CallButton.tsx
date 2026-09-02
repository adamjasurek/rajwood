import type { ReactNode } from 'react'
import { site } from '../content/site'

type CallButtonProps = {
  className?: string
  children?: ReactNode
  variant?: 'solid' | 'bar'
}

export function CallButton({
  className = '',
  children,
  variant = 'solid',
}: CallButtonProps) {
  const base =
    variant === 'bar'
      ? 'flex h-12 w-full items-center justify-center bg-wood text-[0.95rem] font-medium tracking-wide text-paper no-underline'
      : 'inline-flex h-12 items-center justify-center bg-wood px-7 text-[0.95rem] font-medium tracking-wide text-paper no-underline'

  return (
    <a href={`tel:${site.phone.tel}`} className={`${base} ${className}`}>
      {children ?? 'Zavolat'}
    </a>
  )
}
