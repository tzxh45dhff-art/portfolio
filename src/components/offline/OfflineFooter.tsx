import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

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
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="off-footer-section" data-off-section="5">
      <div className="off-footer-title">
        <span className="off-footer-word-left">See the</span>
        <span className="off-footer-word-right">Work.</span>
      </div>
      <div className="off-footer-sub">The online side has everything I&apos;ve built.</div>
      <div>
        <Link to="/" className="off-cta-btn">
          GO TO ONLINE <span className="off-cta-arrow">→</span>
        </Link>
      </div>
      <Link to="/" className="off-back-link">← Back to Home</Link>
    </div>
  )
}
