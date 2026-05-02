import { useEffect, useRef } from 'react'

type Item = { name: string; ver: string; fill: number }
type Category = { header: string; items: Item[] }

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
    header: 'HARDWARE / COMPUTE · ONLINE',
    items: [
      { name: 'Apple Silicon M3', ver: '96GB', fill: 0.88 },
      { name: 'MLX Framework', ver: 'v0.15', fill: 0.82 },
      { name: 'Ollama', ver: 'v0.3', fill: 0.9 },
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

export default function OnlineStack() {
  const rootRef = useRef<HTMLDivElement>(null)

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
    root.querySelectorAll('.on-stack-category').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="on-stack-section" data-on-section="2">
      <div className="on-stack-inner">
        <div className="on-stack-sticky-text">
          <span className="on-stack-big-left">TOOLING</span>
          <span className="on-stack-big-right">&amp; COMPUTE</span>
          <p className="on-stack-sub">Live system telemetry</p>
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
  )
}
