import { useEffect, useRef, useState } from 'react'
import { projects } from '../../data'

// Optional screenshot field — when a project has `image`, that image fills the
// CRT screen. When missing, a "NO SIGNAL" placeholder pattern shows instead.
type ProjectWithImage = (typeof projects)[number] & { image?: string }

function Placeholder({ id }: { id: string }) {
  return (
    <div className="on-mc-placeholder">
      <svg viewBox="0 0 200 120" className="on-mc-svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`stripes-${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill="rgba(200,247,62,0.02)" />
            <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(200,247,62,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="200" height="120" fill={`url(#stripes-${id})`} />
        <text x="100" y="58" textAnchor="middle" fontFamily="monospace" fontSize="11"
          fill="rgba(200,247,62,0.55)" letterSpacing="3">NO SIGNAL</text>
        <text x="100" y="72" textAnchor="middle" fontFamily="monospace" fontSize="7"
          fill="rgba(200,247,62,0.35)" letterSpacing="2">AWAITING FEED · {id.toUpperCase()}</text>
      </svg>
    </div>
  )
}

export default function OnlineProjects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const channelRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [enteredTiles, setEnteredTiles] = useState<Set<number>>(new Set())
  const [enteredChannels, setEnteredChannels] = useState<Set<number>>(new Set())
  const [barIn, setBarIn] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const target = e.target as HTMLElement
          const kind = target.dataset.mcKind
          const idx = Number(target.dataset.mcIdx)
          if (kind === 'tile') setEnteredTiles((s) => (s.has(idx) ? s : new Set(s).add(idx)))
          else if (kind === 'channel') setEnteredChannels((s) => (s.has(idx) ? s : new Set(s).add(idx)))
          else if (kind === 'bar') setBarIn(true)
          io.unobserve(target)
        })
      },
      { threshold: 0.1, rootMargin: '-40px' }
    )
    tileRefs.current.forEach((el) => el && io.observe(el))
    channelRefs.current.forEach((el) => el && io.observe(el))
    if (barRef.current) io.observe(barRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const liveCount = projects.filter((p) => p.featured).length
  const timeStr = now.toLocaleTimeString('en-GB', { hour12: false })

  return (
    <div ref={sectionRef} className="on-mc-section" data-on-section="3">
      <div className="on-mc-header">
        <span className="on-proj-head-left">MISSION</span>
        <span className="on-proj-head-right">CONTROL</span>
      </div>
      <div ref={barRef} data-mc-kind="bar" className={`on-mc-bar ${barIn ? 'in' : ''}`}>
        <span className="on-mc-bar-dot" />
        <span className="on-mc-bar-label">ALL CHANNELS · {projects.length} ACTIVE</span>
        <span className="on-mc-bar-rule" />
        <span className="on-mc-bar-priority">{liveCount} ON PRIORITY FEED</span>
        <span className="on-mc-bar-rule" />
        <span className="on-mc-bar-clock">{timeStr} UTC</span>
      </div>

      <div className="on-mc-layout">
        {/* CHANNEL INDEX */}
        <aside className="on-mc-channels">
          <div className="on-mc-channels-head">CH · NAME · STATUS</div>
          {projects.map((p, i) => (
            <a
              key={p.id}
              ref={(el) => { channelRefs.current[i] = el }}
              data-mc-kind="channel"
              data-mc-idx={i}
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`on-mc-channel-row ${enteredChannels.has(i) ? 'in' : ''} ${active === i ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="on-mc-ch-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="on-mc-ch-name">{p.title}</span>
              <span className={`on-mc-ch-status ${p.featured ? 'is-priority' : ''}`}>
                {p.featured ? '● LIVE' : '○ STDBY'}
              </span>
            </a>
          ))}
          <div className="on-mc-channels-foot">
            <div className="on-mc-signal">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ height: `${i * 20}%` }} />
              ))}
            </div>
            <span>SIGNAL · 100%</span>
          </div>
        </aside>

        {/* MONITOR WALL */}
        <div className="on-mc-wall">
          {(projects as ProjectWithImage[]).map((p, i) => {
            const isActive = active === i
            return (
              <a
                key={p.id}
                ref={(el) => { tileRefs.current[i] = el }}
                data-mc-kind="tile"
                data-mc-idx={i}
                href={p.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`on-mc-tile ${enteredTiles.has(i) ? 'in' : ''} ${p.featured ? 'is-featured' : ''} ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <div className="on-mc-screen">
                  <div className="on-mc-screen-top">
                    <span className="on-mc-rec">{p.featured ? '● REC' : '○ STDBY'}</span>
                    <span className="on-mc-ch">CH{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <div className="on-mc-viz">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="on-mc-shot" loading="lazy" />
                    ) : (
                      <Placeholder id={p.id} />
                    )}
                  </div>

                  <div className="on-mc-screen-bot">
                    <span>{p.year}</span>
                    <span className="on-mc-noise">··· LIVE FEED</span>
                  </div>
                  <div className="on-mc-scanline" />
                  <div className="on-mc-vignette" />
                </div>
                <div className="on-mc-meta">
                  <div className="on-mc-meta-top">
                    <span className="on-mc-title">{p.title}</span>
                    {p.featured && <span className="on-mc-priority-tag">PRIORITY</span>}
                  </div>
                  <p className="on-mc-desc">{p.shortDesc}</p>
                  <div className="on-mc-tags">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="on-mc-tag">{t}</span>
                    ))}
                  </div>
                  <div className="on-mc-foot">
                    <span className="on-mc-arrow">VIEW SOURCE ↗</span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
