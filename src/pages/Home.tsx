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
  const [ready, setReady] = useState(false)
  const [count, setCount] = useState(0)
  const [time, setTime] = useState('')
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [started, setStarted] = useState(false)

  const progress = useMotionValue(0)
  const heroProgress = useMotionValue(0)

  useEffect(() => {
    if (!started) return
    const iv = setInterval(() => {
      setCount(p => {
        if (p >= 100) { clearInterval(iv); setTimeout(() => setReady(true), 400); return 100 }
        return p + 2
      })
    }, 24)
    return () => clearInterval(iv)
  }, [started])

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!ready) return
    const lenis = new Lenis({ lerp: 0.07, duration: 1.5, smoothWheel: true })
    let raf: number
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [ready])

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
      <div className={`preloader${ready ? ' done' : ''}`}>
        <div className="preloader-inner">
          <div className="preloader-name glitch-effect"><div>JAIS</div><div>SINGH</div></div>
          {!started ? (
            <button className="load-btn" onClick={() => setStarted(true)}>LOAD JAIS</button>
          ) : (
            <div className="preloader-count">{count}%</div>
          )}
        </div>
      </div>

      <div className="cursor" style={{ left: cursor.x, top: cursor.y }} />
      <motion.div className="scroll-progress" style={{ scaleX: barScale, width: '100%' }} />

      <div style={{ height: '400vh', pointerEvents: 'none' }} aria-hidden />

      <div className="scene-container">
        {/* Layer 1 — solid dark bg + marquee */}
        <motion.div className="scene" style={{ zIndex: 1, opacity: darkOpacity }}>
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
        <motion.div className="scene" style={{ zIndex: 3, opacity: sigOpacity }}>
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
