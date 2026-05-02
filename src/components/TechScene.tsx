import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const techRow1 = ['REACT', 'TYPESCRIPT', 'FASTAPI', 'PYTHON', 'AI/ML', 'NEXT.JS', 'REACT', 'TYPESCRIPT', 'FASTAPI', 'PYTHON', 'AI/ML', 'NEXT.JS']
const techRow2 = ['NODE.JS', 'MONGODB', 'FIREBASE', 'AZURE', 'TAILWIND', 'CLAUDE API', 'NODE.JS', 'MONGODB', 'FIREBASE', 'AZURE', 'TAILWIND', 'CLAUDE API']

// ── Placeholder "JS" signature path ─────────────
// Replace with your own SVG path data when ready
const SIG_PATH =
  'M 81 42 L 81 178 C 81 204 66 215 48 210 C 30 205 21 190 24 175 ' +
  'M 62 42 L 100 42 ' +
  'M 170 58 C 202 42 238 56 238 82 C 238 108 208 120 182 132 C 156 144 138 160 144 182 C 150 204 178 212 202 203 C 226 194 234 177 231 162'

// Underline flourish
const FLOURISH_PATH = 'M 18 230 C 80 245 170 248 245 238'

interface Props { visible: boolean }

export default function TechScene({ visible }: Props) {
  const pathRef = useRef<SVGPathElement>(null)
  const flourishRef = useRef<SVGPathElement>(null)
  const [drawn, setDrawn] = useState(false)

  // Draw signature when scene dissolves in
  useEffect(() => {
    if (!visible || drawn) return

    const draw = (ref: React.RefObject<SVGPathElement | null>, delay: number) => {
      const path = ref.current
      if (!path) return
      const len = path.getTotalLength()
      path.style.strokeDasharray = `${len}`
      path.style.strokeDashoffset = `${len}`
      setTimeout(() => {
        path.style.transition = `stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)`
        path.style.strokeDashoffset = '0'
      }, delay)
    }

    requestAnimationFrame(() => {
      draw(pathRef, 100)
      draw(flourishRef, 1800)
    })
    setDrawn(true)
  }, [visible, drawn])

  return (
    <div className="tech-scene">
      {/* ── Semi-transparent dark wash over hero ── */}
      <div className="tech-wash" />

      {/* ── Giant scrolling tech text ── */}
      <div className="tech-marquee-bg">
        <div className="tech-row tech-row-1">
          {[0, 1, 2].map(k => (
            <div key={k} className="tech-row-inner" aria-hidden={k > 0}>
              {techRow1.map((t, i) => (
                <span key={i} className="tech-word">
                  {t}<span className="tech-sep"> · </span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="tech-row tech-row-2">
          {[0, 1, 2].map(k => (
            <div key={k} className="tech-row-inner" aria-hidden={k > 0}>
              {techRow2.map((t, i) => (
                <span key={i} className="tech-word">
                  {t}<span className="tech-sep"> · </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Animated signature — center of viewport ── */}
      {/*
        To use YOUR signature SVG:
        1. Open your SVG file, copy the <path d="..."> data
        2. Replace SIG_PATH above with your path data
        3. Adjust viewBox if needed
      */}
      <motion.div
        className="signature-wrap"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <svg
          viewBox="0 0 265 255"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="signature-svg"
        >
          <path
            ref={pathRef}
            d={SIG_PATH}
            stroke="#C8F73E"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            ref={flourishRef}
            d={FLOURISH_PATH}
            stroke="#C8F73E"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity={0.6}
          />
        </svg>
      </motion.div>

      {/* ── Top label ── */}
      <motion.div
        className="tech-label"
        initial={{ opacity: 0, y: 8 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span>Message from</span>
        <strong>JAIS</strong>
      </motion.div>
    </div>
  )
}
