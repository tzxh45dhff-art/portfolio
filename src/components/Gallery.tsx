import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import Reveal from './ui/Reveal'
import useReducedMotion from '../lib/useReducedMotion'

/* Captions describe what is actually in each frame — no invented locations. */
const FRAMES = [
  { id: '01', src: '/media/reel-1.jpg', w: 1600, h: 1200, label: 'Volunteering', note: 'Lions Club drive' },
  { id: '02', src: '/media/offline.jpg', w: 900, h: 1600, label: 'Courtside', note: 'Jump shot' },
  { id: '03', src: '/media/reel-3.jpg', w: 1200, h: 1600, label: 'Off the clock', note: 'Theme park' },
  { id: '04', src: '/media/reel-2.jpg', w: 738, h: 1600, label: 'Between builds', note: 'Field notes' },
]

/**
 * THE REEL — a horizontal photo track that advances while the section is
 * pinned, driven by vertical scroll.
 *
 * Degrades, in this order:
 *   1. `prefers-reduced-motion` → plain scroll-snap carousel
 *   2. viewport under 900px     → plain scroll-snap carousel
 * In both fallbacks the track is a normal horizontally-scrollable list, so the
 * photographs are never unreachable — a pinned track that cannot be driven is
 * worse than no pin at all.
 */
export default function Gallery() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = useState(false)
  const [travel, setTravel] = useState(0)

  const pinned = !reduced && !narrow

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 900px)')
    const sync = () => setNarrow(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [])

  /* How far the track must travel to bring its right edge into view.
     Measured from layout rather than assumed, and re-measured on resize. */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      const overflow = track.scrollWidth - track.clientWidth
      setTravel(Math.max(0, overflow))
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(track)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])

  return (
    <section
      className="reel on-dark"
      data-nav-theme="dark"
      data-pinned={pinned}
      ref={sectionRef}
      style={pinned ? { height: `${Math.round(travel * 0.9 + 900)}px` } : undefined}
    >
      <div className="reel__pin">
        <div className="shell reel__head">
          <span className="eyebrow">02 — Frames</span>
          <h2 className="reel__title display-sm">Off the clock</h2>
          <span className="reel__count mono">{FRAMES.length} frames</span>
        </div>

        <div className="reel__viewport" ref={trackRef}>
          <motion.div className="reel__track" style={pinned ? { x } : undefined}>
            {FRAMES.map((frame, i) => (
              <Reveal className="reel__card" key={frame.id} delay={i * 0.05} y={20} amount={0.1}>
                <figure className="reel__figure">
                  <div className="reel__media">
                    <img
                      className="reel__img"
                      src={frame.src}
                      alt={frame.label}
                      width={frame.w}
                      height={frame.h}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="reel__cap">
                    <span className="reel__cap-id mono">{frame.id}</span>
                    <span className="reel__cap-label">{frame.label}</span>
                    <span className="reel__cap-note mono">{frame.note}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
