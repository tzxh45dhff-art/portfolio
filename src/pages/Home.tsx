import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Hero from '../components/Hero'
import DarkBg from '../components/DarkBg'
import Signature from '../components/Signature'
import AboutText from '../components/AboutText'
import Gallery from '../components/Gallery'
import OnOffLine from '../components/OnOffLine'
import Footer from '../components/Footer'

export default function Home() {
  const [cursor, setCursor] = useState({ x: -100, y: -100 })

  const progress = useMotionValue(0)
  const heroProgress = useMotionValue(0)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.07, duration: 1.5, smoothWheel: true })
    let raf: number
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      progress.set(window.scrollY / total)

      const spacerHeight = window.innerHeight * 4 // 400vh
      heroProgress.set(Math.max(0, Math.min(1, window.scrollY / spacerHeight)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [progress])

  useEffect(() => {
    const mv = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', mv)
    return () => window.removeEventListener('mousemove', mv)
  }, [])

  // Layer 1: dark bg fades in fast
  const darkOpacity = useTransform(heroProgress, [0.06, 0.36], [0, 1])
  // Layer 2: hero shrinks to 40%, turns greyscale
  const heroScale = useTransform(heroProgress, [0, 0.88], [1, 0.40])
  const heroOpacity = useTransform(heroProgress, [0, 0.62, 0.92], [1, 0.90, 0.15])
  const heroGrayscale = useTransform(heroProgress, [0.08, 0.88], [0, 80])
  // Layer 3: signature overlay
  const sigOpacity = useTransform(heroProgress, [0.22, 0.52], [0, 1])

  const barScale = useSpring(progress, { stiffness: 120, damping: 30 })

  return (
    <>
      <div className="cursor" style={{ left: cursor.x, top: cursor.y }} />
      <motion.div className="scroll-progress" style={{ scaleX: barScale, width: '100%' }} />

      <div style={{ height: '400vh', pointerEvents: 'none' }} aria-hidden />

      <div className="scene-container">
        {/* Layer 1 — solid dark bg + marquee */}
        <motion.div className="scene" style={{ zIndex: 1, opacity: darkOpacity, pointerEvents: 'none' }}>
          <DarkBg />
        </motion.div>

        {/* Layer 2 — hero shrinks + greyscale */}
        <motion.div
          className="scene"
          style={{
            zIndex: 2,
            scale: heroScale,
            opacity: heroOpacity,
            filter: useTransform(heroGrayscale, v => `grayscale(${v}%)`),
            overflow: 'hidden',
          }}
        >
          <Hero progress={heroProgress} />
        </motion.div>

        {/* Layer 3 — signature draws on top */}
        <motion.div className="scene" style={{ zIndex: 3, opacity: sigOpacity, pointerEvents: 'none' }}>
          <Signature progress={heroProgress} />
        </motion.div>
      </div>

      <AboutText />
      <Gallery />
      <OnOffLine />
      <Footer />
    </>
  )
}
