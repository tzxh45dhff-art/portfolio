import { useEffect, useRef, useState } from 'react'

const TAGLINE = 'the world outside the screen.'
const BADGES = [
  { label: 'Music', section: 0 },
  { label: 'Movement', section: 1 },
  { label: 'Pages', section: 2 },
  { label: 'Cinema', section: 3 },
]

export default function OfflineHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [activeBadge, setActiveBadge] = useState<number | null>(null)

  const scrollToInterest = (sectionIndex: number) => {
    const interestBlocks = document.querySelectorAll('.off-interest-block')
    const target = interestBlocks[sectionIndex]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setActiveBadge(sectionIndex)
      setTimeout(() => setActiveBadge(null), 1400)
    }
  }

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    // One-shot intro on mount — everything visible without requiring scroll
    requestAnimationFrame(() => {
      wrapper.classList.add('is-ready')
    })
  }, [])

  return (
    <section ref={wrapperRef} className="off-hero" data-off-section="0">
      <div className="off-hero-frame">
        <span className="off-hero-corner tl" />
        <span className="off-hero-corner tr" />
        <span className="off-hero-corner bl" />
        <span className="off-hero-corner br" />
      </div>

      <div className="off-hero-meta-top">
        <span>Vol. 02 — Offline</span>
        <span>Memory · Movement · Mood</span>
      </div>

      <div className="off-hero-content">
        <h1 className="off-hero-title">Offline</h1>

        <p className="off-hero-tagline">{TAGLINE}</p>

        <div className="off-hero-sub">
          <div className="off-hero-name">Jais Singh</div>
          <div className="off-hero-role">Year 1 · CSE AI · Punjab, IN</div>
        </div>

        <nav className="off-hero-badges">
          {BADGES.map((b, i) => (
            <button
              key={b.label}
              className={`off-badge${activeBadge === i ? ' off-badge-active' : ''}`}
              onClick={() => scrollToInterest(b.section)}
              type="button"
            >
              <span className="off-badge-num">0{i + 1}</span>
              <span className="off-badge-label">{b.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="off-hero-meta-bottom">
        <span>Scroll</span>
        <span className="off-hero-meta-rule" />
        <span>An archive in six movements</span>
      </div>
    </section>
  )
}
