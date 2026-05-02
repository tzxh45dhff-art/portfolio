import { useState } from 'react'
import { motion, MotionValue, useTransform } from 'framer-motion'
import { Download } from 'lucide-react'
import { personal } from '../data'

interface Props { progress: MotionValue<number> }

export default function Hero({ progress }: Props) {
  const [imgError, setImgError] = useState(false)
  const uiOpacity = useTransform(progress, [0, 0.22], [1, 0])

  return (
    <section className="hero">
      {/* Portrait — full-bleed, face fills entire hero */}
      <div className="hero-portrait">
        {!imgError ? (
          <img src="/hero.jpg" alt={personal.name} onError={() => setImgError(true)} />
        ) : (
          <div className="hero-portrait-placeholder">
            <p className="portrait-hint">Add photo as <strong>public/hero.jpg</strong></p>
          </div>
        )}
        {/* Gradient overlays for text legibility */}
        <div className="hero-grad-top" />
        <div className="hero-grad-bottom" />
      </div>

      {/* Nav — fades on scroll */}
      <motion.nav className="hero-nav" style={{ opacity: uiOpacity }}>
        <div className="hero-name">
          <span>{personal.firstName}</span>
          <span>{personal.lastName}</span>
        </div>
        <div className="hero-monogram">
          <svg width="44" height="32" viewBox="0 0 44 32" fill="none">
            <text x="0" y="28" fontFamily="Barlow Condensed, sans-serif" fontWeight="900" fontStyle="italic" fontSize="32" fill="#F2EDE4" letterSpacing="-2">JS</text>
          </svg>
        </div>
        <div className="hero-nav-right">
          <a href={personal.resumeUrl} download className="cta-btn">
            <Download size={15} strokeWidth={2.5} /><span>Download Resume</span>
          </a>
        </div>
      </motion.nav>

      {/* Info card — fades on scroll */}
      <motion.div className="hero-card" style={{ opacity: uiOpacity }}>
        <span className="card-label">Currently at</span>
        <div className="card-uni">{personal.university}</div>
        <div className="card-badge"><span>{personal.buildingSince}</span></div>
      </motion.div>
    </section>
  )
}
