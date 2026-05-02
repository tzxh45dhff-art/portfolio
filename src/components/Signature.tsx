import { useEffect, useRef } from 'react'
import { MotionValue, useTransform } from 'framer-motion'

// "Jais Singh" flowing cursive — 14 segments
const SEGS = [
  'M 72 46 L 128 46',
  'M 100 46 L 100 192 C 100 218 84 230 63 222 C 42 214 34 196 39 180',
  'M 158 128 C 157 106 177 96 199 105 C 221 114 224 137 214 155 C 204 173 182 177 172 163 C 162 149 166 130 166 130 L 224 130 L 224 168',
  'M 238 168 L 238 130',
  'M 242 112 C 240 107 248 107 246 112 C 244 117 240 113 242 112',
  'M 256 128 C 276 114 300 122 297 140 C 294 158 273 165 269 178 C 265 191 280 200 298 192',
  'M 348 108 C 382 88 424 104 420 132 C 416 160 386 170 362 184 C 338 198 327 220 338 244 C 349 268 384 274 410 260 C 436 246 441 224 436 206',
  'M 462 140 L 462 234',
  'M 467 120 C 465 115 473 115 471 120 C 469 125 465 121 467 120',
  'M 480 152 L 480 234 C 490 216 506 210 516 214 L 516 234',
  'M 534 140 C 532 118 550 108 568 118 C 586 128 588 150 578 164 C 568 178 549 180 541 168 C 533 156 534 140 534 140',
  'M 568 118 L 568 262 C 568 278 554 284 542 276',
  'M 588 104 L 588 234 C 597 216 610 210 620 214 L 620 234',
  'M 34 262 C 150 284 420 288 645 260',
]

interface Props { progress: MotionValue<number> }

export default function Signature({ progress }: Props) {
  const groupRef = useRef<SVGGElement>(null)
  const lengthsRef = useRef<number[]>([])

  // Map scroll range [0.25 → 0.62] to draw amount [0 → 1]
  const drawAmt = useTransform(progress, [0.25, 0.62], [0, 1])

  // On mount: measure lengths, set initial hidden state
  useEffect(() => {
    const g = groupRef.current
    if (!g) return
    const paths = Array.from(g.querySelectorAll('path'))
    const lens = paths.map(p => p.getTotalLength())
    lengthsRef.current = lens
    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${lens[i]}`
      p.style.strokeDashoffset = `${lens[i]}`
    })
  }, [])

  // Subscribe to drawAmt — animate stroke forward & reverse with scroll
  useEffect(() => {
    return drawAmt.on('change', v => {
      const g = groupRef.current
      if (!g) return
      const paths = Array.from(g.querySelectorAll('path'))
      paths.forEach((p, i) => {
        const len = lengthsRef.current[i] ?? 0
        // Each segment draws in staggered order
        const segStart = (i / SEGS.length) * 0.72
        const segEnd   = segStart + 0.28
        const segV     = Math.max(0, Math.min(1, (v - segStart) / (segEnd - segStart)))
        p.style.strokeDashoffset = `${len * (1 - segV)}`
      })
    })
  }, [drawAmt])

  return (
    <div className="signature-wrap">
      <div className="tech-label">
        <span>Message from</span>
        <strong>JAIS</strong>
      </div>
      <svg viewBox="0 0 660 300" fill="none" className="signature-svg">
        <g ref={groupRef}>
          {SEGS.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="#C8F73E"
              strokeWidth={i === SEGS.length - 1 ? 3.5 : 6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={i === SEGS.length - 1 ? 0.5 : 1}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
