import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  { id: 'hero',     label: 'IDENTITY' },
  { id: 'deploy',   label: 'DEPLOYMENTS' },
  { id: 'activity', label: 'ACTIVITY' },
  { id: 'systems',  label: 'SYSTEMS' },
  { id: 'exit',     label: 'EXIT' },
]

function pad(n: number, w = 2) { return String(n).padStart(w, '0') }

export default function OnlineBackground() {
  const fillRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [clock, setClock] = useState('')
  const [uptime, setUptime] = useState('00:00:00')

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const now = new Date()
      setClock(`${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`)
      const e = Date.now() - start
      const s = Math.floor(e / 1000) % 60
      const m = Math.floor(e / 60000) % 60
      const h = Math.floor(e / 3600000)
      setUptime(`${pad(h)}:${pad(m)}:${pad(s)}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    /* The section list is queried ONCE. The previous version ran
       querySelectorAll on every scroll event and then read
       getBoundingClientRect() per section — a forced layout every frame — and
       called setActive() unconditionally, re-rendering on every scroll tick
       even when the active section had not changed. */
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-on-section]'))
    let ticking = false

    const update = () => {
      ticking = false
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight)
      const p = Math.min(1, window.scrollY / max)
      /* Direct style write, no React involved. */
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`

      const mark = window.innerHeight * 0.45
      let idx = 0
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top < mark) {
          idx = parseInt(sec.dataset.onSection || '0', 10)
        }
      }
      /* Only re-render when the value actually changes. */
      setActive((prev) => (prev === idx ? prev : idx))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (id: string) => {
    const target = document.querySelector<HTMLElement>(`[data-on-id="${id}"]`)
    if (target) window.scrollTo({ top: target.offsetTop - 36, behavior: 'smooth' })
  }

  return (
    <>
      <div className="on-bg">
        <div className="on-bg-aurora" />
        <div className="on-bg-grid" />
        <div className="on-bg-noise" />
      </div>

      <div className="on-topbar">
        <div className="on-topbar-left">
          <span className="on-tb-dot" />
          <span className="on-tb-val">JAIS·OS</span>
          <span className="on-tb-sep" />
          <span className="on-tb-key">v.0.4.7</span>
          <span className="on-tb-sep" />
          <span className="on-tb-key">NODE</span>
          <span className="on-tb-mono">JLD-01</span>
        </div>
        <div className="on-topbar-center">
          <span className="on-tb-key">SESSION</span>
          <span className="on-tb-mono">{clock}</span>
        </div>
        <div className="on-topbar-right">
          <span className="on-tb-key">STATUS</span>
          <span className="on-tb-accent">OPERATIONAL</span>
          <span className="on-tb-sep" />
          <span className="on-tb-key">CPU</span>
          <span className="on-tb-mono">31%</span>
          <span className="on-tb-sep" />
          <span className="on-tb-key">MEM</span>
          <span className="on-tb-mono">2.1G</span>
        </div>
      </div>

      <nav className="on-rail" aria-label="Sections">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`on-rail-item ${active === i ? 'is-active' : ''}`}
            onClick={() => goTo(s.id)}
          >
            <span className="on-rail-tick" />
            <span className="on-rail-label">{pad(i + 1)} · {s.label}</span>
          </button>
        ))}
      </nav>

      <div className="on-progress">
        <div ref={fillRef} className="on-progress-fill" />
      </div>

      <div className="on-statusbar">
        <div className="on-sb-group">
          <span className="on-sb-tag">SECTION</span>
          <span>{pad(active + 1)} / {pad(SECTIONS.length)}</span>
          <span>·</span>
          <span>{SECTIONS[active]?.label}</span>
        </div>
        <div className="on-sb-group">
          <span>UP</span>
          <span className="on-sb-uptime">{uptime}</span>
          <span>·</span>
          <span>SIGNAL 100%</span>
          <span>·</span>
          <span>LAT 12ms</span>
        </div>
      </div>
    </>
  )
}
