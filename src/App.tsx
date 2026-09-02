import { useRef } from 'react'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { StickyCall } from './components/StickyCall'
import { Values } from './components/Values'
import { ScrollTrigger, useGSAP } from './lib/gsap'

function App() {
  const page = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const images = Array.from(document.images)
    const pending = images.filter((img) => !img.complete)

    if (pending.length === 0) {
      ScrollTrigger.refresh()
      return
    }

    let left = pending.length
    const done = () => {
      left -= 1
      if (left <= 0) ScrollTrigger.refresh()
    }

    pending.forEach((img) => {
      img.addEventListener('load', done, { once: true })
      img.addEventListener('error', done, { once: true })
    })
  }, { scope: page })

  return (
    <div ref={page} id="top">
      <Header />
      <main>
        <Hero />
        <Services />
        <Values />
        <Gallery />
      </main>
      <Footer />
      <StickyCall />
    </div>
  )
}

export default App
