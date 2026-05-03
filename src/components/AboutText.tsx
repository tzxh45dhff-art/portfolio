import { useRef } from 'react'
import { motion } from 'framer-motion'

const words = [
  'BUILDING',
  'INTELLIGENT',
  'SYSTEMS',
  'THAT',
  'TURN',
  'COMPLEXITY',
  'INTO',
  'CLARITY.',
  'FULL-STACK',
  'DEVELOPER',
  'OBSESSED',
  'WITH',
  'THE',
  'CONVERGENCE',
  'OF',
  'DESIGN,',
  'ARTIFICIAL',
  'INTELLIGENCE,',
  'AND',
  'FINANCE.',
]

const highlights = new Set([
  'INTELLIGENT', 'SYSTEMS', 'CLARITY.', 'ARTIFICIAL', 'INTELLIGENCE,',
])

export default function AboutText() {
  const ref = useRef<HTMLElement>(null)

  return (
    <motion.section ref={ref} id="about" className="about-section">
      <div className="massive-typography">
        {words.map((word, i) => (
          <span key={i} className="neon-block-wrap" style={{ display: 'inline-block', marginRight: '0.22em' }}>
            <span className={highlights.has(word) ? 'neon-word' : ''}>
              {word}
            </span>
            <motion.div 
              className="neon-block-cover"
              initial={{ scaleX: 1 }}
              whileInView={{ scaleX: 0 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.76, 0, 0.24, 1], 
                delay: 0.05 * i 
              }}
              viewport={{ once: true, margin: "-100px" }}
            />
          </span>
        ))}
      </div>
    </motion.section>
  )
}
