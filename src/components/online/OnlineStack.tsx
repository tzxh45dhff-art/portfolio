import { useEffect, useRef, useState } from 'react'

type Item = { name: string; ver: string; fill: number }
type Category = { header: string; items: Item[] }
type Shipping = { id: string; name: string; status: 'LIVE' | 'BUILDING' | 'TESTING'; uptime: string; tag: string }

const CATEGORIES: Category[] = [
  {
    header: 'ENVIRONMENTS · 3 ACTIVE',
    items: [
      { name: 'Cursor', ver: 'v0.49', fill: 0.95 },
      { name: 'VS Code', ver: 'v1.89', fill: 0.7 },
      { name: 'Antigravity', ver: 'BETA', fill: 0.6 },
    ],
  },
  {
    header: 'AI MODELS · IN USE',
    items: [
      { name: 'Claude Sonnet 4.6', ver: 'PROD', fill: 0.96 },
      { name: 'GPT-4 / GPT-4o', ver: 'PROD', fill: 0.85 },
      { name: 'Gemini 2.0', ver: 'TESTING', fill: 0.7 },
      { name: 'Llama 3 (local)', ver: 'PERSONAL', fill: 0.65 },
    ],
  },
  {
    header: 'CLOUD · AZ-EAST-1',
    items: [
      { name: 'Azure (AZ-900)', ver: 'CERTIFIED', fill: 0.75 },
      { name: 'Docker / Compose', ver: 'v25', fill: 0.85 },
      { name: 'Vercel / Railway', ver: 'PRO', fill: 0.78 },
    ],
  },
  {
    header: 'LANGUAGES · PRIMARY STACK',
    items: [
      { name: 'Python', ver: '3.12', fill: 0.96 },
      { name: 'TypeScript', ver: '5.x', fill: 0.88 },
      { name: 'Rust (learning)', ver: 'WIP', fill: 0.35 },
    ],
  },
]

const SHIPPING: Shipping[] = [
  { id: 'synapse', name: 'SYNAPSE', status: 'LIVE', uptime: '99.7%', tag: 'social · ai' },
  { id: 'kinetic', name: 'KINETIC CITY', status: 'BUILDING', uptime: 'v0.4', tag: 'fintech' },
  { id: 'apex', name: 'APEX AGENT', status: 'TESTING', uptime: 'beta', tag: 'macos · llm' },
]

export default function OnlineStack() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in')
        })
      },
      { threshold: 0.2, rootMargin: '-40px' }
    )
    root.querySelectorAll('.on-stack-category, .on-ship-card').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = now.toLocaleTimeString('en-GB', { hour12: false })

  return (
    <div ref={rootRef} className="on-stack-section" data-on-section="2">
      <div className="on-stack-inner">
        <div className="on-stack-sticky-text">
          <span className="on-stack-big-left">TOOLING</span>
          <span className="on-stack-big-right">&amp; MODELS</span>
          <p className="on-stack-sub">Live system telemetry</p>
        </div>

        <div className="on-stack-right-col">
        {/* CURRENTLY SHIPPING — live banner */}
        <div className="on-shipping-banner">
          <div className="on-shipping-head">
            <div className="on-ship-pulse-dot" />
            <span className="on-ship-label">CURRENTLY SHIPPING</span>
            <span className="on-ship-rule" />
            <span className="on-ship-clock">{timeStr} · IST</span>
          </div>
          <div className="on-shipping-grid">
            {SHIPPING.map((s, i) => (
              <div
                key={s.id}
                className={`on-ship-card status-${s.status.toLowerCase()}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="on-ship-card-top">
                  <span className={`on-ship-status on-ship-${s.status.toLowerCase()}`}>
                    <span className="on-ship-blink" />
                    {s.status}
                  </span>
                  <span className="on-ship-uptime">{s.uptime}</span>
                </div>
                <div className="on-ship-name">{s.name}</div>
                <div className="on-ship-tag">{s.tag}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="on-stack-grid">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.header} className="on-stack-category" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="on-stack-cat-header">
                <div className="on-cat-ping" />
                {cat.header}
              </div>
              <ul className="on-stack-items">
                {cat.items.map((it) => (
                  <li key={it.name} className="on-stack-item">
                    <div className="on-item-status" />
                    <span className="on-item-name">{it.name}</span>
                    <div className="on-item-bar">
                      <div
                        className="on-item-bar-fill"
                        style={{ ['--fill' as string]: it.fill } as React.CSSProperties}
                      />
                    </div>
                    <span className="on-item-ver">{it.ver}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
