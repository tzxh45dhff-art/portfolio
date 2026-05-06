import { useState } from 'react'
import { motion, MotionValue, useTransform } from 'framer-motion'
import { personal } from '../data'
import ContourCanvas from './ContourCanvas'

interface Props { progress: MotionValue<number> }

export default function Hero({ progress }: Props) {
  const [imgError, setImgError] = useState(false)
  const uiOpacity = useTransform(progress, [0, 0.22], [1, 0])

  return (
    <section className="hero hero-light">
      <ContourCanvas count={7} speed={1} />

      {/* JS monogram — sits inside hero so it shrinks/scrolls away with it */}
      <motion.div className="hero-mono-top" style={{ opacity: uiOpacity }}>
        {personal.monogram}
      </motion.div>

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
