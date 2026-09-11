import { Gallery } from '../components/Gallery'
import { site } from '../content/site'

export function RealizationsPage() {
  return (
    <main>
      <Gallery
        projects={site.gallery.projects}
        title={site.gallery.pageTitle}
        heading="h1"
        compact
      />
    </main>
  )
}
