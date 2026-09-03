import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import Hero from '../components/Hero'
import HeroNav from '../components/HeroNav'
import DarkBg from '../components/DarkBg'
import Signature from '../components/Signature'
import AboutText from '../components/AboutText'
import Gallery from '../components/Gallery'
import OnOffLine from '../components/OnOffLine'
import Footer from '../components/Footer'

/**
 * The pinned opening act.
 *
 * Scrolling the 400vh rail drives one continuous timeline: the hero shrinks
 * and cools while an olive ground rises behind it and the signature draws on
 * top. Hero and Signature are rendered exactly as they were — only the
 * choreography around them changed.
 *
 * Three things this deliberately no longer does, all of which made scrolling
 * stutter:
 *
 *  - It does not construct a Lenis instance. App.tsx owns the single app-wide
 *    one; a second instance means two smooth-scroll engines writing scrollTop
 *    on the same frame.
 *  - It does not animate `filter: grayscale()`. A filter whose value changes
 *    every frame forces a full repaint of the hero — portrait included — on
 *    every one. The same desaturation is now a static layer cross-faded on
 *    opacity, which stays on the compositor.
 *  - It does not hand-roll a scroll listener, and it no longer renders its own
 *    progress bar (ScrollIndicator is global chrome now).
 */
export default function Home() {
  const railRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start start', 'end end'],
  })

  /* Ground swap: a solid olive layer rises on opacity alone. */
  const darkOpacity = useTransform(scrollYProgress, [0.06, 0.36], [0, 1])

  /* The hero settles back into the page. Transform + opacity only. */
  const heroScale = useTransform(scrollYProgress, [0, 0.88], [1, 0.4])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.62, 0.92], [1, 0.9, 0.15])

  /* Static desaturating wash, cross-faded in rather than filtered per frame. */
  const heroCool = useTransform(scrollYProgress, [0.08, 0.88], [0, 0.8])

  const sigOpacity = useTransform(scrollYProgress, [0.22, 0.52], [0, 1])

  return (
    <>
      <HeroNav />

      <div className="rail" ref={railRef}>
        <div className="rail__pin">
          {/* Layer 1 — olive ground + marquee */}
          <motion.div
            className="scene"
            style={{ zIndex: 1, opacity: darkOpacity, pointerEvents: 'none' }}
          >
            <DarkBg />
          </motion.div>

          {/* Layer 2 — the hero, shrinking away */}
          <motion.div
            className="scene"
            style={{ zIndex: 2, scale: heroScale, opacity: heroOpacity, overflow: 'hidden' }}
          >
            <Hero progress={scrollYProgress} />
            <motion.span className="rail__cool" style={{ opacity: heroCool }} aria-hidden="true" />
          </motion.div>

          {/* Layer 3 — signature draws over the top */}
          <motion.div
            className="scene"
            style={{ zIndex: 3, opacity: sigOpacity, pointerEvents: 'none' }}
          >
            <Signature progress={scrollYProgress} />
          </motion.div>
        </div>
      </div>

      <AboutText />
      <Gallery />
      <OnOffLine />
      <Footer />
    </>
  )
}
