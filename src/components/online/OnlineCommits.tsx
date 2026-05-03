import { useEffect, useMemo, useRef, useState } from 'react'
import { personal } from '../../data'

const MONTHS_ALL = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
// Extract username from the github URL in data.ts so it stays in sync
const GITHUB_USERNAME = (personal.socials.github.match(/github\.com\/([^/?#]+)/i)?.[1] || '').trim()

type Contrib = { date: string; count: number; level: number }
type Stats = {
  repos: number
  followers: number
  following: number
  totalCommits: number
  loaded: boolean
  error: boolean
}

function generateFallbackCells(): Contrib[] {
  // Used while real data loads or if API fails
  const cells: Contrib[] = []
  const today = new Date()
  for (let i = 53 * 7 - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const r = Math.random()
    const lvl = r < 0.3 ? 0 : r < 0.55 ? 1 : r < 0.8 ? 2 : r < 0.95 ? 3 : 4
    cells.push({ date: d.toISOString().slice(0, 10), count: lvl * 3, level: lvl })
  }
  return cells
}

function buildMonthLabels(cells: Contrib[]): string[] {
  // 53 weeks, label every ~4-5 weeks with the month of the first day in that column
  if (cells.length === 0) return []
  const labels: string[] = []
  let lastMonth = -1
  for (let week = 0; week < 53; week++) {
    const cell = cells[week * 7]
    if (!cell) { labels.push(''); continue }
    const m = new Date(cell.date).getMonth()
    if (m !== lastMonth && week % 4 === 0) {
      labels.push(MONTHS_ALL[m])
      lastMonth = m
    } else {
      labels.push('')
    }
  }
  return labels
}

export default function OnlineCommits() {
  const headerRef = useRef<HTMLDivElement>(null)
  const heatmapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const fallback = useMemo(generateFallbackCells, [])
  const [contribs, setContribs] = useState<Contrib[]>(fallback)
  const [stats, setStats] = useState<Stats>({
    repos: 0,
    followers: 0,
    following: 0,
    totalCommits: 0,
    loaded: false,
    error: false,
  })

  // Fetch GitHub data
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        // Profile data (public, no auth needed)
        const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
        if (!profileRes.ok) throw new Error('profile fail')
        const profile = await profileRes.json()

        // Contributions (uses jogruber's free GitHub contributions API mirror)
        const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`)
        let contribCells: Contrib[] = fallback
        let totalCommits = 0
        if (contribRes.ok) {
          const data = await contribRes.json()
          if (Array.isArray(data.contributions)) {
            // Take last 53*7 days
            const all: Contrib[] = data.contributions.map((c: { date: string; count: number; level: number }) => ({
              date: c.date,
              count: c.count,
              level: c.level,
            }))
            contribCells = all.slice(-53 * 7)
            totalCommits = contribCells.reduce((s, c) => s + c.count, 0)
          }
          if (data.total && typeof data.total === 'object') {
            const totals = Object.values(data.total) as number[]
            if (totals.length > 0) {
              totalCommits = totals.reduce((s, n) => s + n, 0)
            }
          }
        }

        if (cancelled) return
        setContribs(contribCells)
        setStats({
          repos: profile.public_repos ?? 0,
          followers: profile.followers ?? 0,
          following: profile.following ?? 0,
          totalCommits,
          loaded: true,
          error: false,
        })
      } catch {
        if (cancelled) return
        setStats((s) => ({ ...s, loaded: true, error: true }))
      }
    }

    load()
    return () => { cancelled = true }
  }, [fallback])

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

  // Reorganize cells: rows = days of week, cols = weeks (GitHub-style)
  const rendered = useMemo(() => {
    // Pad start so first column starts on Sunday
    const padded = [...contribs]
    if (padded.length > 0) {
      const first = new Date(padded[0].date)
      const dow = first.getDay() // 0 = Sun
      for (let i = 0; i < dow; i++) {
        padded.unshift({ date: '', count: 0, level: 0 })
      }
    }
    return padded.slice(0, 53 * 7)
  }, [contribs])

  const months = useMemo(() => buildMonthLabels(rendered), [rendered])
  const formatNum = (n: number) => n.toLocaleString()

  return (
    <div className="on-commits-section" data-on-section="3">
      <div ref={headerRef} className="on-commits-header">
        <span className="on-commits-head-left">Proof of&nbsp;</span>
        <span className="on-commits-head-right">Work</span>
      </div>

      <div className="on-heatmap-wrap">
        <div ref={heatmapRef} className="on-heatmap">
          {rendered.map((cell, i) => (
            <div
              key={i}
              className={`on-hm-cell on-hm-${Math.min(4, cell.level)}`}
              title={cell.date ? `${cell.count} contributions on ${cell.date}` : ''}
            />
          ))}
        </div>
        <div className="on-hm-month-row">
          {months.map((m, i) => (
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
            {stats.loaded && !stats.error
              ? `LIVE · @${GITHUB_USERNAME}`
              : stats.error
              ? 'OFFLINE FALLBACK'
              : 'FETCHING…'}
          </div>
          <div className="on-hm-card-text">
            Real-time pull from GitHub. Public commits, repos, and connections.
          </div>
          <div className="on-hm-card-stat">
            <div className="on-hm-stat">
              <div className="on-hm-stat-num">{formatNum(stats.totalCommits || 0)}</div>
              <div className="on-hm-stat-label">Commits</div>
            </div>
            <div className="on-hm-stat">
              <div className="on-hm-stat-num">{formatNum(stats.repos)}</div>
              <div className="on-hm-stat-label">Repos</div>
            </div>
            <div className="on-hm-stat">
              <div className="on-hm-stat-num">{formatNum(stats.followers)}</div>
              <div className="on-hm-stat-label">Followers</div>
            </div>
            <div className="on-hm-stat">
              <div className="on-hm-stat-num">{formatNum(stats.following)}</div>
              <div className="on-hm-stat-label">Following</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
