import { useEffect, useRef } from 'react'
import { personal } from '../../data'

const MODULES = ['LOCAL · LLMS', 'VECTOR · DB', 'AGENT · STACK', 'CLOUD · AZURE', 'TYPESCRIPT', 'PYTHON · FASTAPI']

export default function OnlineHero() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const r = root.current
    if (!r) return
    requestAnimationFrame(() => {
      r.querySelector('.on-hero-status')?.classList.add('in')
      r.querySelector('.on-hero-title')?.classList.add('in')
      r.querySelector('.on-hero-side')?.classList.add('in')
    })
    r.querySelectorAll<HTMLElement>('.on-hero-mod').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 600 + i * 70)
    })
  }, [])

  return (
    <section ref={root} className="on-hero" data-on-section="0" data-on-id="hero">
      <div className="on-hero-top">
        <div className="on-hero-status">
          <span className="dot" />
          <span><strong>System online.</strong> Currently building intelligent infrastructure.</span>
        </div>
        <div className="on-hero-id-card">
          <span>OPERATOR · {personal.name.toUpperCase()}</span>
          <span>{personal.location.toUpperCase()}</span>
          <span>{personal.degree.toUpperCase()}</span>
        </div>
      </div>

      <div className="on-hero-main">
        <h1 className="on-hero-title">
          <span className="dim">/&nbsp;</span>online<span className="accent-bar" />
        </h1>
        <div className="on-hero-side">
          <p className="on-hero-bio">
            <strong>Jais Singh</strong> — full-stack developer working on the intersection
            of intelligent systems, finance, and the engineering of premium digital interfaces.
            This page is a live index of the work currently online.
          </p>
          <div className="on-hero-meta-grid">
            <div className="on-hero-meta-item">
              <span className="on-hero-meta-key">FOCUS</span>
              <span className="on-hero-meta-val">AI Systems · Full-Stack</span>
            </div>
            <div className="on-hero-meta-item">
              <span className="on-hero-meta-key">DEPLOY · STACK</span>
              <span className="on-hero-meta-val">React · TS · Python · FastAPI</span>
            </div>
            <div className="on-hero-meta-item">
              <span className="on-hero-meta-key">AVAILABILITY</span>
              <span className="on-hero-meta-val accent">OPEN · INTERN ENGAGEMENTS</span>
            </div>
            <div className="on-hero-meta-item">
              <span className="on-hero-meta-key">SINCE</span>
              <span className="on-hero-meta-val">2024 · BUILDING WITH AI</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="on-hero-telemetry">
          <div className="on-tel-cell">
            <span className="on-tel-key">DEPLOYMENTS · LIVE</span>
            <span className="on-tel-val accent">09</span>
            <span className="on-tel-trend">+2 THIS QTR</span>
          </div>
          <div className="on-tel-cell">
            <span className="on-tel-key">VERIFIED · SYSTEMS</span>
            <span className="on-tel-val">06</span>
            <span className="on-tel-trend">— ALL CURRENT</span>
          </div>
          <div className="on-tel-cell">
            <span className="on-tel-key">FIELD · RECORDS</span>
            <span className="on-tel-val">02</span>
            <span className="on-tel-trend">TOP 7 / TOP 30</span>
          </div>
          <div className="on-tel-cell">
            <span className="on-tel-key">UPTIME · 30D</span>
            <span className="on-tel-val">99.9%</span>
            <span className="on-tel-trend">NOMINAL</span>
          </div>
        </div>

        <div className="on-hero-bottom">
          <div className="on-hero-modules">
            {MODULES.map((m) => (
              <span key={m} className="on-hero-mod">{m}</span>
            ))}
          </div>
          <div className="on-hero-scroll-hint">
            SCROLL TO INDEX <span className="arrow" />
          </div>
        </div>
      </div>
    </section>
  )
}
