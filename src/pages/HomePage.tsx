import { Gallery } from '../components/Gallery'
import { Hero } from '../components/Hero'
import { Services } from '../components/Services'
import { Values } from '../components/Values'
import { homeProjects, site } from '../content/site'

export function HomePage() {
  const projects = homeProjects()

  return (
    <main>
      <Hero />
      <Services />
      <Values />
      <Gallery
        projects={projects}
        title={site.gallery.title}
        sectionId={site.gallery.id}
        allHref={
          projects.length < site.gallery.projects.length
            ? site.gallery.path
            : undefined
        }
      />
    </main>
  )
}
