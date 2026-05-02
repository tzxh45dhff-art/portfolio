import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function AboutText() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return (
    <motion.section
      ref={ref}
      className="about-section"
    >
      <div className="massive-typography">
        BUILDING{' '}
        <span className="neon-block-wrap">
          INTELLIGENT SYSTEMS
          <motion.div 
            className="neon-block-cover"
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            viewport={{ once: true, margin: "-150px" }}
          />
        </span>{' '}
        THAT TURN COMPLEXITY INTO{' '}
        <span className="neon-block-wrap">
          CLARITY
          <motion.div 
            className="neon-block-cover"
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
            viewport={{ once: true, margin: "-150px" }}
          />
        </span>. 
        <br />
        FULL-STACK DEVELOPER OBSESSED WITH THE CONVERGENCE OF DESIGN,{' '}
        <span className="neon-block-wrap">
          ARTIFICIAL INTELLIGENCE
          <motion.div 
            className="neon-block-cover"
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
            viewport={{ once: true, margin: "-150px" }}
          />
        </span>, AND FINANCE.
      </div>
    </motion.section>
  )
}
