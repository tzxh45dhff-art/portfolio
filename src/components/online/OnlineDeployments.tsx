import { useEffect, useRef } from 'react'
import { projects } from '../../data'

const REGION_BY_INDEX = ['us-west-2', 'eu-fra-1', 'ap-mum-1', 'us-east-1', 'eu-lon-2', 'ap-sin-1']

export default function OnlineDeployments() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const r = rootRef.current
    if (!r) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement
            const delay = Number(t.dataset.idx || 0) * 60
            setTimeout(() => t.classList.add('in'), delay)
            io.unobserve(t)
          }
        })
      },
      { threshold: 0.12, rootMargin: '-50px' }
    )
    r.querySelectorAll<HTMLElement>('.on-deploy').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const live = projects.filter((p) => p.featured).length

  return (
    <section className="on-section" data-on-section="1" data-on-id="deploy">
      <header className="on-section-head">
        <div>
          <div className="on-sh-id">02 · DEPLOYMENTS</div>
          <h2 className="on-sh-title">
            Active <em>environments</em>
          </h2>
        </div>
        <div className="on-sh-meta">
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">TOTAL</span>
            <span className="on-sh-meta-val">{String(projects.length).padStart(2, '0')}</span>
          </div>
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">PRIORITY · FEED</span>
            <span className="on-sh-meta-val">{String(live).padStart(2, '0')}</span>
          </div>
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">REGIONS</span>
            <span className="on-sh-meta-val">06</span>
          </div>
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">LAST · BUILD</span>
            <span className="on-sh-meta-val">passed · 12s ago</span>
          </div>
        </div>
      </header>

      <div ref={rootRef} className="on-deploy-list">
        {projects.map((p, i) => (
          <a
            key={p.id}
            href={p.githubUrl || p.liveUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="on-deploy"
            data-idx={i}
          >
            <span className="on-deploy-idx">DPL/{String(i + 1).padStart(2, '0')}</span>
            <div className="on-deploy-title">
              <span className="on-deploy-name">{p.title}</span>
              <span className="on-deploy-role">{p.role}</span>
            </div>
            <div>
              <p className="on-deploy-desc">{p.shortDesc}</p>
              <div className="on-deploy-stack" style={{ marginTop: 10 }}>
                {p.tags.slice(0, 4).map((t) => (
                  <span key={t} className="on-deploy-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="on-deploy-status">
              <span className={`on-deploy-state ${p.featured ? 'is-live' : ''}`}>
                <span className="dot" />
                {p.featured ? 'LIVE' : 'STANDBY'}
              </span>
              <span className="on-deploy-meta">{REGION_BY_INDEX[i % REGION_BY_INDEX.length]}</span>
              <span className="on-deploy-meta">{p.year}</span>
            </div>
            <span className="on-deploy-arrow">↗</span>
          </a>
        ))}
      </div>
    </section>
  )
}
