import { motion, useScroll, useSpring } from 'framer-motion'
import useReducedMotion from '../lib/useReducedMotion'

/**
 * Hairline lime rail down the right edge, filling with scroll progress.
 *
 * scaleY only — never height — so it stays on the compositor. The spring is
 * dropped under reduced motion, where the raw progress value is used directly.
 */
export default function ScrollIndicator() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <div className="chrome-rail" aria-hidden="true">
      <motion.span
        className="chrome-rail__fill"
        style={{ scaleY: reduced ? scrollYProgress : smooth }}
      />
    </div>
  )
}
