import { Link, type LinkProps, useLocation, useNavigate } from 'react-router-dom'
import { scrollToHash } from '../lib/scroll'

function resolveHref(to: LinkProps['to']) {
  if (typeof to === 'string') return to
  return `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`
}

export function HashLink({ to, onClick, ...props }: LinkProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Link
      to={to}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const href = resolveHref(to)
        if (!href.includes('#')) return
        const url = new URL(href, window.location.origin)
        if (url.pathname !== location.pathname) return
        event.preventDefault()
        if (location.hash !== url.hash) navigate(href)
        scrollToHash(url.hash, 'smooth')
      }}
      {...props}
    />
  )
}
