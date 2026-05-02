import { useEffect, useMemo, useRef } from 'react'

const MONTHS = ['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY']

function generateCells(): number[] {
  // Deterministic-ish weighted distribution; recent weeks brighter.
  const cells: number[] = []
  const baseLevels = [0, 0, 0, 0, 1, 1, 2, 2, 3, 4]
  for (let i = 0; i < 53 * 7; i++) {
    const week = Math.floor(i / 7)
    const r = Math.random()
    let lvl: number
    if (week > 44) lvl = r < 0.15 ? 0 : r < 0.35 ? 1 : r < 0.6 ? 2 : r < 0.85 ? 3 : 4
    else if (week > 30) lvl = r < 0.2 ? 0 : r < 0.45 ? 1 : r < 0.7 ? 2 : r < 0.9 ? 3 : 4
    else lvl = baseLevels[Math.floor(r * baseLevels.length)]
    cells.push(lvl)
  }
  return cells
}

export default function OnlineCommits() {
  const headerRef = useRef<HTMLDivElement>(null)
  const heatmapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const cells = useMemo(generateCells, [])

  useEffect(() => {
    const header = headerRef.current
    const heatmap = heatmapRef.current
    const card = cardRef.current
    if (!header || !heatmap || !card) return

    const headerIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) header.classList.add('in')
        })
      },
      { threshold: 0.2 }
    )
    headerIO.observe(header)

    const heatIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            heatmap.classList.add('in')
            card.classList.add('in')
          }
        })
      },
      { threshold: 0.25 }
    )
    heatIO.observe(heatmap)

    return () => {
      headerIO.disconnect()
      heatIO.disconnect()
    }
  }, [])

  return (
    <div className="on-commits-section" data-on-section="3">
      <div ref={headerRef} className="on-commits-header">
        <span className="on-commits-head-left">Proof of&nbsp;</span>
        <span className="on-commits-head-right">Work</span>
      </div>

      <div className="on-heatmap-wrap">
        <div ref={heatmapRef} className="on-heatmap">
          {cells.map((lvl, i) => (
            <div key={i} className={`on-hm-cell on-hm-${lvl}`} title={`${lvl} contributions`} />
          ))}
        </div>
        <div className="on-hm-month-row">
          {MONTHS.map((m, i) => (
            <span key={i} className="on-hm-month">{m}</span>
          ))}
        </div>
        <div ref={cardRef} className="on-heatmap-card">
          <div className="on-hm-card-label">
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--lime)',
                animation: 'onPulseDot 2s infinite',
                flexShrink: 0,
              }}
            />
            ALWAYS BUILDING
          </div>
          <div className="on-hm-card-text">
            Always building. Actively competing in hackathons and pushing to production.
          </div>
          <div className="on-hm-card-stat">
            <div className="on-hm-stat">
              <div className="on-hm-stat-num">847</div>
              <div className="on-hm-stat-label">Commits</div>
            </div>
            <div className="on-hm-stat">
              <div className="on-hm-stat-num">12</div>
              <div className="on-hm-stat-label">Projects</div>
            </div>
            <div className="on-hm-stat">
              <div className="on-hm-stat-num">3</div>
              <div className="on-hm-stat-label">Hackathons</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
