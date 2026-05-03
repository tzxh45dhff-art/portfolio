import { useState } from 'react'
import { motion, MotionValue, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { personal } from '../data'
import ContourCanvas from './ContourCanvas'

interface Props { progress: MotionValue<number> }

export default function Hero({ progress }: Props) {
  const [imgError, setImgError] = useState(false)
  const uiOpacity = useTransform(progress, [0, 0.22], [1, 0])

  return (
    <section className="hero hero-light">
      <ContourCanvas count={7} speed={1} />

      {/* Portrait */}
      <div className="hero-portrait-wrap">
        {!imgError ? (
          <img
            className="hero-portrait-img"
            src="/hero.jpg"
            alt={personal.name}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="hero-portrait-ph">
            <span className="hero-portrait-mono">{personal.monogram}</span>
            <span className="ph-label">Photo coming soon</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <motion.nav className="hero-nav-light" style={{ opacity: uiOpacity }}>
        <div className="nav-name">
          <span>{personal.firstName.charAt(0) + personal.firstName.slice(1).toLowerCase()}</span>
          <span>{personal.lastName.charAt(0) + personal.lastName.slice(1).toLowerCase()}</span>
        </div>

        <div className="nav-mono">{personal.monogram}</div>

        <div className="nav-right">
          <Link to="/contact" className="btn-lime">CONTACT</Link>
          <a href={personal.resumeUrl} download className="btn-outline">DOWNLOAD RESUME</a>
          <button className="btn-sq" aria-label="Menu">
            <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
              <line x1="0" y1="1" x2="15" y2="1" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="0" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Info cards bottom-left */}
      <motion.div className="info-cards" style={{ opacity: uiOpacity }}>
        <div className="info-card">
          <span className="ic-sup">Currently at</span>
          <span className="ic-main">{personal.university}</span>
          <span className="ic-sub">{personal.degree}</span>
        </div>
        <div className="info-card">
          <span className="ic-sup">Building</span>
          <span className="ic-main">Local LLMs &amp; Agents</span>
          <span className="ic-sub">Student · Developer · Designer</span>
        </div>
      </motion.div>

      {/* Vertical role tag right */}
      <motion.div className="role-tag" style={{ opacity: uiOpacity }}>
        Student · Developer · Creator
      </motion.div>

      {/* Scroll cue */}
      <motion.div className="scroll-cue" style={{ opacity: uiOpacity }}>
        <span className="sc-txt">Explore</span>
        <span className="sc-line" />
      </motion.div>
    </section>
  )
}
