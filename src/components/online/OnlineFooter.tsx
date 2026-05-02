import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function OnlineFooter() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) el.classList.add('in')
        })
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="on-footer-section" data-on-section="4">
      <div className="on-footer-pre">// SYSTEM: INITIATING POWER DOWN</div>
      <div className="on-footer-title">
        <span className="on-ft-word-left">Power</span>
        <span className="on-ft-word-right">Down.</span>
      </div>
      <div className="on-footer-sub">The offline side is where the screen goes dark.</div>
      <div>
        <Link to="/offline" className="on-cta-btn">
          GO TO OFFLINE <span className="on-cta-arrow">→</span>
        </Link>
      </div>
      <Link to="/" className="on-back-link">← Back to Home</Link>
    </div>
  )
}
