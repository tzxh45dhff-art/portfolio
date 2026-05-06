import { useEffect, useRef } from 'react'
import TransitionLink from '../TransitionLink'
import { personal } from '../../data'

export default function OnlineFooter() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) el.classList.add('in') })
      },
      { threshold: 0.18 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="on-footer" data-on-section="4" data-on-id="exit">
      <div className="on-footer-pre">SESSION · PREPARING TO HANDOFF</div>
      <h2 className="on-footer-title">
        End of feed. <em>The signal continues offline.</em>
      </h2>
      <p className="on-footer-sub">
        Every running module on this page mirrors something I'm actually building.
        For the work that doesn't fit a deployment grid — the writing, the prototypes,
        the offline thinking — cross over.
      </p>
      <div className="on-footer-actions">
        <TransitionLink to="/offline" className="on-cta">
          ENTER OFFLINE LAYER <span className="arr">→</span>
        </TransitionLink>
        <TransitionLink to="/" className="on-back">← Return to home</TransitionLink>
      </div>

      <div className="on-footer-sig">
        <div>
          <span className="key">OPERATOR</span>
          <span className="val">{personal.name}</span>
        </div>
        <div>
          <span className="key">CONTACT</span>
          <a className="val" href={`mailto:${personal.email}`}>{personal.email}</a>
        </div>
        <div>
          <span className="key">GITHUB</span>
          <a className="val" href={personal.socials.github} target="_blank" rel="noopener noreferrer">
            @{(personal.socials.github.match(/github\.com\/([^/?#]+)/i)?.[1] || '').trim()}
          </a>
        </div>
        <div>
          <span className="key">STATUS</span>
          <span className="val accent">OPEN · INTERN ENGAGEMENTS</span>
        </div>
      </div>
    </section>
  )
}
