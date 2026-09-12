import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../content/site'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  localBusinessJsonLd,
  pageSeo,
} from '../lib/seo'

const OG_WIDTH = '1200'
const OG_HEIGHT = '630'
const BUSINESS_ID = 'jsonld-business'
const BREADCRUMB_ID = 'jsonld-breadcrumb'

function meta(
  attr: 'name' | 'property',
  key: string,
  content: string | null,
) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)

  if (!content) {
    el?.remove()
    return
  }

  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }

  el.content = content
}

function canonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!href) {
    el?.remove()
    return
  }

  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }

  el.href = href
}

function jsonLd(id: string, data: object | null) {
  let el = document.getElementById(id) as HTMLScriptElement | null

  if (!data) {
    el?.remove()
    return
  }

  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }

  el.textContent = JSON.stringify(data)
}

export function SeoHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = pageSeo(pathname)
    const image = absoluteUrl(site.seo.ogImage)
    const indexed = page.robots.startsWith('index')

    document.title = page.title
    meta('name', 'description', page.description)
    meta('name', 'robots', page.robots)
    canonical(page.canonical)

    meta('property', 'og:locale', 'cs_CZ')
    meta('property', 'og:type', 'website')
    meta('property', 'og:site_name', site.name)
    meta('property', 'og:title', page.title)
    meta('property', 'og:description', page.description)
    meta('property', 'og:url', page.canonical)
    meta('property', 'og:image', image)
    meta('property', 'og:image:width', OG_WIDTH)
    meta('property', 'og:image:height', OG_HEIGHT)
    meta('property', 'og:image:alt', site.hero.image.alt)

    meta('name', 'twitter:card', 'summary_large_image')
    meta('name', 'twitter:title', page.title)
    meta('name', 'twitter:description', page.description)
    meta('name', 'twitter:image', image)

    jsonLd(BUSINESS_ID, indexed ? localBusinessJsonLd() : null)
    jsonLd(
      BREADCRUMB_ID,
      page.breadcrumbs ? breadcrumbJsonLd(page.breadcrumbs) : null,
    )
  }, [pathname])

  return null
}
