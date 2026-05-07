import { useEffect, useRef } from 'react'
import TransitionLink from '../TransitionLink'

export default function OfflineFooter() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) el.classList.add('in-view')
        })
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="off-footer-section" data-off-section="5">
      <div className="off-footer-eyebrow">
        <span>VI — Closing</span>
        <span className="off-footer-eyebrow-rule" />
        <span>End of archive</span>
      </div>

      <h2 className="off-footer-title">
        <span className="off-footer-line off-footer-line-1">See the</span>
        <span className="off-footer-line off-footer-line-2"><em>work.</em></span>
      </h2>

      <p className="off-footer-sub">
        The other side of this page is everything that's been built — running, deployed, indexed.
        Cross over.
      </p>

      <div className="off-footer-cta-row">
        <TransitionLink to="/online" className="off-cta-btn">
          <span>Enter the online layer</span>
          <span className="off-cta-arrow" aria-hidden>→</span>
        </TransitionLink>
        <TransitionLink to="/" className="off-back-link">
          ← Return home
        </TransitionLink>
      </div>

      <div className="off-footer-colophon">
        <span>Colophon</span>
        <span>Set in Inter &amp; Barlow Condensed</span>
        <span>Punjab, IN — 2025</span>
        <span>Jaisgurnoor Singh</span>
      </div>
    </div>
  )
}
