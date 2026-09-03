import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

import Home from './pages/Home'
import Offline from './pages/Offline'
import Online from './pages/Online'
import Contact from './pages/Contact'

import CustomCursor from './components/CustomCursor'
import ScrollIndicator from './components/ScrollIndicator'
import TransitionScreen from './components/TransitionScreen'
import { TransitionProvider } from './context/TransitionContext'
import useReducedMotion from './lib/useReducedMotion'
import './index.css'

export default function App() {
  const location = useLocation()
  const lenisRef = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()

  /* ── One Lenis instance for the whole app ───────────────────────────
     This used to be constructed inside Home, which meant smooth scrolling
     existed only on the landing route — and any second instance would fight
     the first for scrollTop on the same frame. */
  useEffect(() => {
    if (reduced) {
      lenisRef.current = null
      return
    }

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, touchMultiplier: 1.6 })
    lenisRef.current = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  /* Every route change lands at the top, instantly. */
  useEffect(() => {
    window.scrollTo(0, 0)
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [location.pathname])

  return (
    <TransitionProvider>
      <TransitionScreen />
      <CustomCursor />
      <ScrollIndicator />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="/online" element={<Online />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
    </TransitionProvider>
  )
}
