import { useRef, useState } from 'react'
import TransitionLink from './TransitionLink'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

export default function OnOffLine() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  const [onlineImgFailed, setOnlineImgFailed] = useState(false)
  const [offlineImgFailed, setOfflineImgFailed] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })
  const bg = useTransform(scrollYProgress, [0, 0.4, 1], ['#373E26', '#454C34', '#EDEBE5'])
  const textColor = useTransform(scrollYProgress, [0, 0.5, 1], ['#F2EDE4', '#F2EDE4', '#0A0A0A'])
  const descColor = useTransform(scrollYProgress, [0, 0.5, 1], ['rgba(242,237,228,0.5)', 'rgba(242,237,228,0.5)', '#555'])
  const topoOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0, 0.7])

  return (
    <motion.section
      ref={sectionRef}
      className="ool-section"
      id="on-off-line"
      style={{ background: bg }}
    >
      {/* Topographic SVG background */}
      <motion.svg
        className="ool-topo"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden
        style={{ opacity: topoOpacity }}
      >
        <path d="M0,180 C240,120 480,260 720,180 C960,100 1200,240 1440,180" />
        <path d="M0,280 C200,220 440,340 720,260 C1000,180 1240,320 1440,280" />
        <path d="M0,400 C280,340 520,480 760,400 C1000,320 1200,440 1440,400" />
        <path d="M0,520 C180,460 400,580 680,500 C960,420 1220,560 1440,520" />
        <path d="M0,640 C260,580 500,700 740,620 C980,540 1200,680 1440,640" />
        <path d="M0,760 C220,700 460,820 700,740 C940,660 1180,780 1440,760" />
        <path d="M0,100 C300,40 560,160 800,80 C1040,0 1280,120 1440,80" />
        <path d="M0,860 C240,800 480,900 720,840 C960,780 1200,880 1440,860" />
      </motion.svg>

      {/* Section header — pinned top */}
      <div className="ool-header">
        <span className="ool-header-index">03</span>
        <span className="ool-header-title">Explore</span>
        <span className="ool-header-rule" />
        <span className="ool-header-sub">Two sides of the same developer</span>
      </div>

      {/* Left panel — wrapper handles absolute centering, motion.div handles slide */}
      <div className="ool-panel-wrap ool-panel-wrap-left">
        <motion.div
          className="ool-panel"
          animate={inView ? { x: 0, opacity: 1 } : { x: -180, opacity: 0 }}
          initial={{ x: -180, opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          {!onlineImgFailed ? (
            <img
              src="/images/online.jpg"
              alt="Online — Projects & Terminal"
              className="ool-panel-img"
              onError={() => setOnlineImgFailed(true)}
            />
          ) : (
            <div className="ool-placeholder">
              <span className="ool-cursor-blink">█</span>
              <span className="ool-placeholder-label">MacBook · Terminal</span>
            </div>
          )}
          <div className="ool-glow ool-glow-left" />
          <div className="ool-fade ool-fade-left" />
        </motion.div>
      </div>

      {/* Right panel — wrapper handles absolute centering, motion.div handles slide */}
      <div className="ool-panel-wrap ool-panel-wrap-right">
        <motion.div
          className="ool-panel"
          animate={inView ? { x: 0, opacity: 1 } : { x: 180, opacity: 0 }}
          initial={{ x: 180, opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        >
          {!offlineImgFailed ? (
            <img
              src="/images/offline.jpg"
              alt="Offline — Life beyond the screen"
              className="ool-panel-img"
              onError={() => setOfflineImgFailed(true)}
            />
          ) : (
            <div className="ool-placeholder">
              <span className="ool-cursor-blink">█</span>
              <span className="ool-placeholder-label">Headphones · Offline</span>
            </div>
          )}
          <div className="ool-glow ool-glow-right" />
          <div className="ool-fade ool-fade-right" />
        </motion.div>
      </div>

      {/* Center typography — absolutely centered */}
      <div className="ool-center">
        <div className="ool-col">
          <div className="ool-title-stack">
            <span className="ool-prefix ool-prefix-lime">ON</span>
            <motion.span className="ool-big" style={{ color: textColor }}>LINE.</motion.span>
          </div>
          <motion.p className="ool-desc" style={{ color: descColor }}>
            Projects, builds, and everything I've shipped.
          </motion.p>
          <TransitionLink to="/online" className="ool-arrow-btn" aria-label="View Online">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 15L15 5M15 5H7M15 5V13" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </TransitionLink>
        </div>

        <div className="ool-col">
          <div className="ool-title-stack">
            <motion.span className="ool-prefix" style={{ color: textColor }}>OFF</motion.span>
            <motion.span className="ool-big" style={{ color: textColor }}>LINE.</motion.span>
          </div>
          <motion.p className="ool-desc" style={{ color: descColor }}>
            Interests, obsessions, and life beyond the screen.
          </motion.p>
          <TransitionLink to="/offline" className="ool-arrow-btn" aria-label="View Offline">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 15L15 5M15 5H7M15 5V13" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </TransitionLink>
        </div>
      </div>
    </motion.section>
  )
}
