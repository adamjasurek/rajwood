import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin)

gsap.defaults({
  ease: 'power3.out',
  duration: 0.85,
})

ScrollTrigger.config({
  autoRefreshEvents: 'visibilitychange,resize',
  ignoreMobileResize: true,
})

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP }
