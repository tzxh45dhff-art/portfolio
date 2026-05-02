import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const techRow1 = ['REACT', 'TYPESCRIPT', 'FASTAPI', 'PYTHON', 'AI/ML', 'NEXT.JS', 'REACT', 'TYPESCRIPT', 'FASTAPI', 'PYTHON', 'AI/ML', 'NEXT.JS']
const techRow2 = ['NODE.JS', 'MONGODB', 'FIREBASE', 'AZURE', 'TAILWIND', 'CLAUDE API', 'NODE.JS', 'MONGODB', 'FIREBASE', 'AZURE', 'TAILWIND', 'CLAUDE API']

export default function DarkBg() {
  return (
    <div className="tech-scene">
      <div className="tech-wash" />
      <div className="tech-marquee-bg">
        <div className="tech-row tech-row-1">
          {[0, 1, 2].map(k => (
            <div key={k} className="tech-row-inner" aria-hidden={k > 0}>
              {techRow1.map((t, i) => (
                <span key={i} className="tech-word">{t}<span className="tech-sep"> · </span></span>
              ))}
            </div>
          ))}
        </div>
        <div className="tech-row tech-row-2">
          {[0, 1, 2].map(k => (
            <div key={k} className="tech-row-inner" aria-hidden={k > 0}>
              {techRow2.map((t, i) => (
                <span key={i} className="tech-word">{t}<span className="tech-sep"> · </span></span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
