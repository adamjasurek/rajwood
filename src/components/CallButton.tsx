import type { ReactNode } from 'react'
import { site } from '../content/site'

export function CallButton({ children }: { children: ReactNode }) {
  return (
    <a
      href={`tel:${site.phone.tel}`}
      className="flex h-12 w-full items-center justify-center bg-wood text-[0.95rem] font-medium tracking-wide text-paper no-underline"
    >
      {children}
    </a>
  )
}
