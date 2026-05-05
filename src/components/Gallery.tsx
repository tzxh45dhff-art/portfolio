import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

import { projects } from '../data'

const highlighted = projects
  .filter(p => p.featured)
  .map(p => ({
    ...p,
    context: p.fullDesc
  }))

// Lerp between two RGB colors
function lerpRGB(a: number[], b: number[], t: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t))
}

const INK = [10, 10, 10]
const CREAM = [240, 237, 230]

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollRange, setScrollRange] = useState(0)
  const [progress, setProgress] = useState(0)
  const [bgColor, setBgColor] = useState('rgb(10,10,10)')
  const x = useMotionValue(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20, mass: 1 })

  // Drive background color transition from dark to cream
  useEffect(() => {
    return smoothProgress.on('change', (v) => {
      const t = Math.max(0, Math.min(1, v / 0.45))
      setProgress(t)
      const rgb = lerpRGB(INK, CREAM, t)
      setBgColor(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`)
    })
  }, [smoothProgress])

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setScrollRange(trackRef.current.scrollWidth - window.innerWidth)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section || scrollRange <= 0) return
      const rect = section.getBoundingClientRect()
      const sectionH = section.offsetHeight - window.innerHeight
      const p = Math.max(0, Math.min(1, -rect.top / sectionH))
      x.set(-p * scrollRange)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollRange, x])

  // Smooth lerped colors — only section bg transitions
  const t = progress
  
  // Header adapts to background
  const headerColor = `rgb(${lerpRGB([242,237,228], [20,20,20], t).join(',')})`
  const headerSubColor = `rgba(${lerpRGB([242,237,228], [80,80,80], t).join(',')}, 0.7)`
  
  // Cards ALWAYS stay dark for premium contrast
  const cardBg = '#404730'
  const cardBorder = `rgba(200,247,62, ${0.08 + t * 0.12})` // lime border gets stronger on light bg
  const cardShadow = t > 0.3 
    ? `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(200,247,62,${0.05 + t * 0.1})` 
    : '0 2px 12px rgba(0,0,0,0.15)'
  
  const wavyOpacity = Math.min(1, progress * 2)

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="gallery-section"
      style={{
        height: `${Math.max(200, scrollRange + window.innerHeight)}px`,
        background: bgColor,
      }}
    >
      <div className="gallery-sticky">
        {/* Flowing wavy lines — fade in with scroll */}
        <div className="gallery-waves" style={{ opacity: wavyOpacity }}>
          <svg viewBox="0 0 1512 828" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-50,150 Q200,50 400,200 T800,180 T1200,250 T1600,150" stroke="rgba(200,247,62,0.25)" strokeWidth="1.5" fill="none" className="wavy-line" />
            <path d="M-50,350 Q150,250 350,380 T750,320 T1100,400 T1600,300" stroke="rgba(200,247,62,0.18)" strokeWidth="1" fill="none" className="wavy-line wavy-2" />
            <path d="M-50,550 Q250,450 500,580 T900,520 T1300,600 T1600,500" stroke="rgba(200,247,62,0.15)" strokeWidth="1.2" fill="none" className="wavy-line wavy-3" />
            <path d="M-50,700 Q200,620 450,720 T850,680 T1250,750 T1600,680" stroke="rgba(200,247,62,0.12)" strokeWidth="0.8" fill="none" className="wavy-line wavy-4" />
            <circle cx="200" cy="600" r="120" stroke="rgba(200,247,62,0.08)" strokeWidth="0.6" fill="none" className="wavy-line" />
            <circle cx="1300" cy="250" r="160" stroke="rgba(200,247,62,0.06)" strokeWidth="0.5" fill="none" className="wavy-line wavy-2" />
          </svg>
        </div>

        <div className="gallery-header">
          <span className="gallery-label" style={{ color: headerColor }}>HIGHLIGHTED PROJECTS</span>
          <span className="gallery-count" style={{ color: headerSubColor }}>{highlighted.length} PROJECTS</span>
        </div>
        <motion.div ref={trackRef} className="gallery-track" style={{ x }}>
          {highlighted.map((project, i) => (
            <div
              key={project.id}
              className="proj-card"
              style={{
                background: cardBg,
                borderColor: cardBorder,
                boxShadow: cardShadow,
              }}
            >
              {/* Screenshot placeholder */}
              <div className="proj-screenshot">
                <div className="proj-screenshot-placeholder">
                  <div className="proj-ss-browser-bar">
                    <span className="proj-ss-dot" />
                    <span className="proj-ss-dot" />
                    <span className="proj-ss-dot" />
                    <span className="proj-ss-url">{project.id}.app</span>
                  </div>
                  <div className="proj-ss-body">
                    <div className="proj-ss-logo">{project.title.charAt(0)}</div>
                    <div className="proj-ss-lines">
                      <div className="proj-ss-line" style={{ width: '70%' }} />
                      <div className="proj-ss-line" style={{ width: '50%' }} />
                      <div className="proj-ss-line" style={{ width: '60%' }} />
                    </div>
                    <div className="proj-ss-grid">
                      <div className="proj-ss-block" />
                      <div className="proj-ss-block" />
                      <div className="proj-ss-block" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card content */}
              <div className="proj-info">
                <div className="proj-meta">
                  <span className="proj-num">0{i + 1}</span>
                  <span className="proj-year">{project.year}</span>
                </div>
                <h3 className="proj-title">{project.title}</h3>
                <p className="proj-desc">{project.shortDesc}</p>
                <p className="proj-context">{project.context}</p>
                <div className="proj-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="proj-tag">{tag}</span>
                  ))}
                </div>
                <div className="proj-links">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="proj-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    GitHub
                  </a>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="proj-link proj-link-live">
                    <ExternalLink size={14} /> Live
                  </a>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
