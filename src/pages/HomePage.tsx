import { Gallery } from '../components/Gallery'
import { Hero } from '../components/Hero'
import { Services } from '../components/Services'
import { Values } from '../components/Values'

export function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <Values />
      <Gallery />
    </main>
  )
}
