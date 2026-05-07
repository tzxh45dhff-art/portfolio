import { useEffect, useMemo, useState } from 'react'
import { personal } from '../../data'

const GH = (personal.socials.github.match(/github\.com\/([^/?#]+)/i)?.[1] || '').trim()

type Cell = { date: string; count: number; level: number }
type Stats = { repos: number; followers: number; following: number; totalCommits: number }

const SEEDED_STREAM: { time: string; tag: 'feat'|'fix'|'chore'|'docs'; sha: string; msg: string }[] = [
  { time: '12m',  tag: 'feat',  sha: 'a1f2e09', msg: 'kinetic — wire AI mentor stream into portfolio analytics view' },
  { time: '38m',  tag: 'fix',   sha: '3b04c11', msg: 'synapse — debounce feed refresh on websocket reconnect' },
  { time: '1h',   tag: 'feat',  sha: 'c882fd4', msg: 'apex — add tool-use loop with structured output schema' },
  { time: '3h',   tag: 'chore', sha: '7e1a230', msg: 'verifiai — bump fastapi & pin python 3.12 in build matrix' },
  { time: '6h',   tag: 'feat',  sha: 'fa9b22d', msg: 'online — premium dashboard rewrite, telemetry strip, side rail' },
  { time: '1d',   tag: 'docs',  sha: '0c4c918', msg: 'kinetic — readme: add architecture diagram + ai system note' },
  { time: '1d',   tag: 'fix',   sha: 'd31aa05', msg: 'mindpop — handle empty session gracefully on first run' },
  { time: '2d',   tag: 'feat',  sha: 'ee76b91', msg: 'unsaid-page — animated section transitions with reduced motion' },
]

function fallbackCells(): Cell[] {
  const out: Cell[] = []
  const today = new Date()
  for (let i = 53 * 7 - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i)
    const r = Math.random()
    const lvl = r < 0.35 ? 0 : r < 0.6 ? 1 : r < 0.8 ? 2 : r < 0.94 ? 3 : 4
    out.push({ date: d.toISOString().slice(0, 10), count: lvl * 3, level: lvl })
  }
  return out
}

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

function monthLabels(cells: Cell[]) {
  const out: string[] = []
  let last = -1
  for (let w = 0; w < 53; w++) {
    const c = cells[w * 7]
    if (!c?.date) { out.push(''); continue }
    const m = new Date(c.date).getMonth()
    if (m !== last && w % 4 === 0) { out.push(MONTHS[m]); last = m } else out.push('')
  }
  return out
}

export default function OnlineActivity() {
  const fallback = useMemo(fallbackCells, [])
  const [cells, setCells] = useState<Cell[]>(fallback)
  const [stats, setStats] = useState<Stats>({ repos: 0, followers: 0, following: 0, totalCommits: 0 })
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const profileRes = await fetch(`https://api.github.com/users/${GH}`)
        if (!profileRes.ok) throw new Error()
        const profile = await profileRes.json()
        const cRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${GH}?y=last`)
        let next: Cell[] = fallback
        let total = 0
        if (cRes.ok) {
          const data = await cRes.json()
          if (Array.isArray(data.contributions)) {
            const all: Cell[] = data.contributions.map((c: { date: string; count: number; level: number }) => ({
              date: c.date, count: c.count, level: c.level,
            }))
            next = all.slice(-53 * 7)
            total = next.reduce((s, c) => s + c.count, 0)
          }
          if (data.total && typeof data.total === 'object') {
            const totals = Object.values(data.total) as number[]
            if (totals.length) total = totals.reduce((s, n) => s + n, 0)
          }
        }
        if (cancelled) return
        setCells(next)
        setStats({
          repos: profile.public_repos ?? 0,
          followers: profile.followers ?? 0,
          following: profile.following ?? 0,
          totalCommits: total,
        })
        setLoaded(true)
      } catch {
        if (!cancelled) { setLoaded(true); setErr(true) }
      }
    })()
    return () => { cancelled = true }
  }, [fallback])

  const padded = useMemo(() => {
    const out = [...cells]
    if (out.length > 0 && out[0].date) {
      const dow = new Date(out[0].date).getDay()
      for (let i = 0; i < dow; i++) out.unshift({ date: '', count: 0, level: 0 })
    }
    return out.slice(0, 53 * 7)
  }, [cells])

  const months = useMemo(() => monthLabels(padded), [padded])
  const liveLabel = !loaded ? 'FETCHING' : err ? 'OFFLINE FALLBACK' : `LIVE · @${GH}`

  return (
    <section className="on-section" data-on-section="2" data-on-id="activity">
      <header className="on-section-head">
        <div>
          <div className="on-sh-id">03 · ACTIVITY</div>
          <h2 className="on-sh-title">
            Live <em>development stream</em>
          </h2>
        </div>
        <div className="on-sh-meta">
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">SOURCE</span>
            <span className="on-sh-meta-val">github.com/{GH}</span>
          </div>
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">FEED · STATE</span>
            <span className="on-sh-meta-val">{loaded ? 'STREAMING' : 'CONNECTING'}</span>
          </div>
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">LATENCY</span>
            <span className="on-sh-meta-val">12ms</span>
          </div>
        </div>
      </header>

      <div className="on-activity">
        <div className="on-panel">
          <div className="on-panel-head">
            <div className="on-panel-head-left">
              <span>CONTRIBUTION · GRAPH</span>
            </div>
            <div className="on-panel-head-right">
              <span className="on-panel-pill">
                <span className="dot" />
                {liveLabel}
              </span>
            </div>
          </div>
          <div className="on-panel-body">
            <div className="on-heat">
              {padded.map((c, i) => (
                <div
                  key={i}
                  className={`on-heat-cell lvl-${Math.min(4, c.level)}`}
                  title={c.date ? `${c.count} contributions · ${c.date}` : ''}
                />
              ))}
            </div>
            <div className="on-heat-months">
              {months.map((m, i) => (<span key={i}>{m}</span>))}
            </div>
            <div className="on-heat-stats">
              <div className="on-heat-stat">
                <span className="on-heat-stat-num">{stats.totalCommits.toLocaleString()}</span>
                <span className="on-heat-stat-key">COMMITS · 365D</span>
              </div>
              <div className="on-heat-stat">
                <span className="on-heat-stat-num">{stats.repos}</span>
                <span className="on-heat-stat-key">PUBLIC · REPOS</span>
              </div>
              <div className="on-heat-stat">
                <span className="on-heat-stat-num">{stats.followers}</span>
                <span className="on-heat-stat-key">FOLLOWERS</span>
              </div>
              <div className="on-heat-stat">
                <span className="on-heat-stat-num">{stats.following}</span>
                <span className="on-heat-stat-key">FOLLOWING</span>
              </div>
            </div>
          </div>
        </div>

        <div className="on-panel">
          <div className="on-panel-head">
            <div className="on-panel-head-left">
              <span>RECENT · COMMITS</span>
            </div>
            <div className="on-panel-head-right">
              <span className="on-panel-pill">
                <span className="dot" />
                STREAMING
              </span>
            </div>
          </div>
          <div className="on-panel-body">
            <div className="on-stream">
              {SEEDED_STREAM.map((s, i) => (
                <div key={i} className="on-stream-row">
                  <span className="on-stream-time">{s.time} ago</span>
                  <span className="on-stream-msg">
                    <span className={`tag ${s.tag}`}>{s.tag}</span>
                    {s.msg}
                  </span>
                  <span className="on-stream-sha">{s.sha}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
