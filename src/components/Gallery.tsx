import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'

const galleryItems = [
  { id: 1, src: '/gallery/1.jpg', label: 'HACKATHON, 2026', size: 'tall' },
  { id: 2, src: '/gallery/2.jpg', label: 'BUILD DAY, 2025', size: 'wide' },
  { id: 3, src: '/gallery/3.jpg', label: 'WORKSHOP, 2025', size: 'square' },
  { id: 4, src: '/gallery/4.jpg', label: 'DEMO DAY, 2026', size: 'tall' },
  { id: 5, src: '/gallery/5.jpg', label: 'CAMPUS, 2025', size: 'wide' },
]

// Lerp between two hex colours at progress t (0–1)
function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return `rgb(${clamp(a[0] + (b[0] - a[0]) * t)}, ${clamp(a[1] + (b[1] - a[1]) * t)}, ${clamp(a[2] + (b[2] - a[2]) * t)})`
}

const INK: [number, number, number] = [10, 10, 10]        // #0A0A0A
const OLIVE: [number, number, number] = [20, 31, 10]      // #141f0a

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollRange, setScrollRange] = useState(0)
  const x = useMotionValue(0)

  // useScroll tracks when the section scrolls through the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  // Spring adds lag so colour bleed is gradual, not instant
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20, mass: 1 })

  // Write directly to body.background — no section border visible
  useEffect(() => {
    return smoothProgress.on('change', (v) => {
      const t = Math.max(0, Math.min(1, v / 0.55))
      document.body.style.background = lerpColor(INK, OLIVE, t)
    })
  }, [smoothProgress])

  // Restore body background when scrolled well past gallery
  useEffect(() => {
    return () => { document.body.style.background = '' }
  }, [])

  // Measure horizontal scroll range
  useEffect(() => {
    const measure = () => {
      if (trackRef.current && sectionRef.current) {
        setScrollRange(trackRef.current.scrollWidth - window.innerWidth)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Drive horizontal track on vertical scroll
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section || scrollRange <= 0) return
      const rect = section.getBoundingClientRect()
      const sectionH = section.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, -rect.top / sectionH))
      x.set(-progress * scrollRange)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollRange, x])

  return (
    <section
      ref={sectionRef}
      className="gallery-section"
      style={{ height: `${Math.max(200, scrollRange + window.innerHeight)}px` }}
    >
      <div className="gallery-sticky">
        <div className="gallery-header">
          <span className="gallery-label">CERTIFICATIONS</span>
          <span className="gallery-count">{galleryItems.length} PHOTOS</span>
        </div>
        <motion.div ref={trackRef} className="gallery-track" style={{ x }}>
          {galleryItems.map((item) => (
            <div key={item.id} className={`gallery-card gallery-${item.size}`}>
              <div className="gallery-img-wrap">
                <img
                  src={item.src}
                  alt={item.label}
                  onError={e => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                    if (placeholder) placeholder.style.display = 'flex'
                  }}
                />
                <div className="gallery-placeholder" style={{ display: 'none' }}>
                  <span>{item.size === 'tall' ? '📸' : item.size === 'wide' ? '🖼️' : '◻️'}</span>
                </div>
              </div>
              <span className="gallery-caption">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
