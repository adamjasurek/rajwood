import { site } from '../content/site'

const NO_INDEX = 'noindex, nofollow'
const INDEX = 'index, follow'

export type SeoPage = {
  title: string
  description: string
  canonical: string | null
  robots: string
  breadcrumbs: { name: string; path: string }[] | null
}

export function absoluteUrl(path: string) {
  return new URL(path, `${site.url}/`).href
}

export function pageSeo(pathname: string): SeoPage {
  if (pathname === '/') {
    return {
      title: site.seo.home.title,
      description: site.seo.home.description,
      canonical: absoluteUrl('/'),
      robots: INDEX,
      breadcrumbs: null,
    }
  }

  if (pathname === site.gallery.path) {
    return {
      title: site.seo.realizations.title,
      description: site.seo.realizations.description,
      canonical: absoluteUrl(site.gallery.path),
      robots: INDEX,
      breadcrumbs: [
        { name: 'Úvod', path: '/' },
        { name: site.gallery.pageTitle, path: site.gallery.path },
      ],
    }
  }

  if (pathname === site.legal.privacy.path) {
    return {
      title: site.seo.privacy.title,
      description: site.seo.privacy.description,
      canonical: absoluteUrl(site.legal.privacy.path),
      robots: INDEX,
      breadcrumbs: [
        { name: 'Úvod', path: '/' },
        { name: site.legal.privacy.label, path: site.legal.privacy.path },
      ],
    }
  }

  return {
    title: site.seo.notFound.title,
    description: site.seo.home.description,
    canonical: null,
    robots: NO_INDEX,
    breadcrumbs: null,
  }
}

export function localBusinessJsonLd() {
  const sameAs = [site.social.instagram, site.social.facebook].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: site.name,
    url: site.url,
    image: absoluteUrl(site.seo.ogImage),
    logo: absoluteUrl(site.logo.src),
    telephone: site.phone.tel,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressLocality: site.seat,
      postalCode: site.postalCode,
      addressCountry: 'CZ',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: site.region,
    },
    ...(sameAs.length ? { sameAs } : {}),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '08:00',
      closes: '16:00',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${site.services.title} ${site.services.titleRest}`,
      itemListElement: site.services.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.name,
          description: item.text,
        },
      })),
    },
  }
}

export function breadcrumbJsonLd(
  crumbs: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}
