import { useEffect, useRef, useState, useCallback } from 'react'
import { projects } from '../../data'

export default function OnlineProjects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const angleRef = useRef(0)
  const velocityRef = useRef(0.3) // base auto-spin speed
  const targetVelRef = useRef(0.3)
  const rafRef = useRef(0)
  const lastScrollY = useRef(0)
  const isPaused = useRef(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [, forceRender] = useState(0)

  const count = projects.length
  const sliceAngle = 360 / count

  // Scroll-reactive velocity
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const currentY = window.scrollY
        const delta = currentY - lastScrollY.current
        lastScrollY.current = currentY

        // Only react when section is near viewport
        const section = sectionRef.current
        if (section) {
          const rect = section.getBoundingClientRect()
          const inView = rect.top < window.innerHeight && rect.bottom > 0
          if (inView && Math.abs(delta) > 1) {
            // Map scroll delta to velocity: scroll down = positive, scroll up = negative
            const boost = delta * 0.08
            targetVelRef.current = boost
          } else if (inView) {
            // Slowly decay towards base speed
            targetVelRef.current = 0.3
          }
        }
        ticking = false
      })
    }
    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Animation loop
  useEffect(() => {
    const tick = () => {
      if (!isPaused.current) {
        // Smoothly lerp velocity towards target
        velocityRef.current += (targetVelRef.current - velocityRef.current) * 0.04
        angleRef.current += velocityRef.current
        forceRender((n) => n + 1)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleMouseEnter = useCallback((idx: number) => {
    isPaused.current = true
    setHovered(idx)
  }, [])

  const handleMouseLeave = useCallback(() => {
    isPaused.current = false
    setHovered(null)
  }, [])

  // 3D carousel radius based on card count
  const radius = count * 48

  return (
    <div ref={sectionRef} className="on-projects-section" data-on-section="3">
      <div className="on-projects-header">
        <span className="on-proj-head-left">ALL</span>
        <span className="on-proj-head-right">PROJECTS</span>
      </div>
      <p className="on-proj-head-sub">Scroll to spin · Hover to inspect</p>

      <div className="on-carousel-viewport">
        <div
          className="on-carousel-ring"
          style={{
            transform: `rotateY(${angleRef.current}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {projects.map((p, i) => {
            const rot = sliceAngle * i
            const isActive = hovered === i
            return (
              <a
                key={p.id}
                href={p.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`on-carousel-card ${isActive ? 'active' : ''} ${p.featured ? 'featured' : ''}`}
                style={{
                  transform: `rotateY(${rot}deg) translateZ(${radius}px)`,
                }}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="on-cc-index">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="on-cc-title">{p.title}</div>
                <div className="on-cc-desc">{p.shortDesc}</div>
                <div className="on-cc-tags">
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="on-cc-tag">{t}</span>
                  ))}
                </div>
                <div className="on-cc-footer">
                  <span className="on-cc-year">{p.year}</span>
                  <span className="on-cc-arrow">↗ GITHUB</span>
                </div>
                {p.featured && <div className="on-cc-featured-dot" />}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
