import { useEffect, useRef, useState } from 'react'

type Project = {
  id: string
  branch: string
  index: string
  name: string
  desc: string
  tags: string[]
  visual: 'chart' | 'graph' | 'terminal' | 'err'
  vizLabel: string
  url?: string
}

const PROJECTS: Project[] = [
  {
    id: 'KINETIC',
    branch: 'KINETIC — main',
    index: '01 / 04',
    name: 'KINETIC',
    desc:
      'A real-time motion capture pipeline that feeds into a local LLM for action classification. Sub-20ms inference on Apple Silicon.',
    tags: ['Python', 'MLX', 'CoreML', 'FastAPI'],
    visual: 'chart',
    vizLabel: 'INFERENCE LATENCY · LIVE',
    url: 'https://github.com/khushibagga20/kinetic-city',
  },
  {
    id: 'APEX',
    branch: 'APEX — awareness/main',
    index: '02 / 04',
    name: 'APEX Continuous Awareness',
    desc:
      'Agent framework for persistent context. Maintains a rolling window of environmental state, fed into a retrieval-augmented reasoning loop.',
    tags: ['Ollama', 'LangChain', 'ChromaDB', 'Next.js'],
    visual: 'graph',
    vizLabel: 'AGENT TOPOLOGY',
    url: 'https://github.com/tzxh45dhff-art/apex',
  },
  {
    id: 'VECTORAI',
    branch: 'VECTORAI — build/prod',
    index: '03 / 04',
    name: 'Actian VectorAI Build',
    desc:
      "High-throughput vector embedding pipeline using Actian's columnar engine. Handles 10M+ document ingestion with semantic clustering.",
    tags: ['Actian', 'Python', 'FAISS', 'Docker'],
    visual: 'terminal',
    vizLabel: 'PIPELINE LOG · RUNNING',
    url: 'https://github.com/tzxh45dhff-art/synapse',
  },
  {
    id: 'STEALTH',
    branch: 'UNTITLED — wip/main',
    index: '04 / 04',
    name: 'STEALTH',
    desc: 'Under active development. Details shipping soon. Built on local LLMs + edge inference.',
    tags: ['CLASSIFIED'],
    visual: 'err',
    vizLabel: 'STATUS: BUILDING',
  },
]

function ChartViz() {
  return (
    <svg viewBox="0 0 480 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="onChartGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8F73E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C8F73E" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[60, 120, 180].map((y) => (
        <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(200,247,62,0.06)" strokeWidth="1" />
      ))}
      {[80, 160, 240, 320, 400].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="240" stroke="rgba(200,247,62,0.06)" strokeWidth="1" />
      ))}
      <path
        d="M0,180 C40,160 80,90 120,110 C160,130 200,60 240,80 C280,100 320,40 360,60 C400,80 440,50 480,70 L480,240 L0,240 Z"
        fill="url(#onChartGrad1)"
        opacity="0.5"
      />
      <path
        className="on-chart-line"
        d="M0,180 C40,160 80,90 120,110 C160,130 200,60 240,80 C280,100 320,40 360,60 C400,80 440,50 480,70"
        fill="none"
        stroke="#C8F73E"
        strokeWidth="1.5"
      />
      <circle cx="120" cy="110" r="3" fill="#C8F73E" opacity="0.8" />
      <circle cx="240" cy="80" r="3" fill="#C8F73E" opacity="0.8" />
      <circle cx="360" cy="60" r="3" fill="#C8F73E" opacity="0.8" />
      <text x="8" y="195" fontFamily="monospace" fontSize="8" fill="rgba(200,247,62,0.4)">0ms</text>
      <text x="8" y="135" fontFamily="monospace" fontSize="8" fill="rgba(200,247,62,0.4)">10ms</text>
      <text x="8" y="75" fontFamily="monospace" fontSize="8" fill="rgba(200,247,62,0.4)">20ms</text>
      <text x="420" y="88" fontFamily="monospace" fontSize="9" fill="#C8F73E">LIVE</text>
    </svg>
  )
}

function GraphViz() {
  return (
    <svg viewBox="0 0 480 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="onNodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C8F73E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C8F73E" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[
        [240, 120, 120, 60],
        [240, 120, 360, 60],
        [240, 120, 120, 180],
        [240, 120, 360, 180],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(200,247,62,0.2)" strokeWidth="1" />
      ))}
      {[
        [120, 60, 60, 30],
        [360, 60, 420, 30],
        [120, 180, 60, 210],
        [360, 180, 420, 210],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={`o${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(200,247,62,0.1)" strokeWidth="1" />
      ))}
      {[
        [240, 120, 20],
        [120, 60, 12],
        [360, 60, 12],
        [120, 180, 12],
        [360, 180, 12],
      ].map(([cx, cy, r], i) => (
        <circle key={`g${i}`} cx={cx} cy={cy} r={r} fill="url(#onNodeGlow)" />
      ))}
      <circle cx="240" cy="120" r="6" fill="#C8F73E" className="on-node-circle" />
      {[
        [120, 60],
        [360, 60],
        [120, 180],
        [360, 180],
      ].map(([cx, cy], i) => (
        <circle key={`n${i}`} cx={cx} cy={cy} r="4" fill="#C8F73E" opacity="0.7" />
      ))}
      {[
        [60, 30],
        [420, 30],
        [60, 210],
        [420, 210],
      ].map(([cx, cy], i) => (
        <circle key={`s${i}`} cx={cx} cy={cy} r="2.5" fill="#C8F73E" opacity="0.4" />
      ))}
      <text x="226" y="145" fontFamily="monospace" fontSize="8" fill="rgba(200,247,62,0.6)">CORE</text>
      <text x="100" y="55" fontFamily="monospace" fontSize="7" fill="rgba(200,247,62,0.4)">RAG</text>
      <text x="346" y="55" fontFamily="monospace" fontSize="7" fill="rgba(200,247,62,0.4)">CTX</text>
      <text x="103" y="196" fontFamily="monospace" fontSize="7" fill="rgba(200,247,62,0.4)">MEM</text>
      <text x="344" y="196" fontFamily="monospace" fontSize="7" fill="rgba(200,247,62,0.4)">API</text>
    </svg>
  )
}

function TerminalViz() {
  const lines: Array<[string, number]> = [
    ['$ python embed.py --batch=10000', 0.5],
    ['[INFO] Loading model: nomic-embed-text', 0.35],
    ['[INFO] Connecting to Actian Vector...', 0.35],
    ['[OK]   Connected. Tables: 4', 0.7],
    ['[RUN]  Batch 1/100 ████████░░ 84%', 0.35],
    ['[RUN]  Vectors: 841,920 indexed', 0.35],
    ['[PERF] 9,420 docs/sec', 0.35],
    ['[CLUS] Clustering 128-dim space...', 0.5],
    ['[CLUS] 48 semantic clusters found', 0.35],
    ['[DONE] Pipeline complete. ETA: 12s', 0.7],
  ]
  return (
    <svg viewBox="0 0 480 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="240" fill="rgba(0,0,0,0.3)" rx="2" />
      {lines.map(([t, op], i) => (
        <text
          key={i}
          x="16"
          y={30 + i * 18}
          fontFamily="monospace"
          fontSize="10"
          fill={`rgba(200,247,62,${op})`}
        >
          {t}
        </text>
      ))}
      <rect x="16" y="206" width="8" height="14" fill="#C8F73E" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}

function ErrViz() {
  return (
    <div className="on-err-placeholder">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="38" height="38" rx="3" stroke="rgba(200,247,62,0.3)" strokeWidth="1" />
        <line x1="8" y1="8" x2="32" y2="32" stroke="rgba(200,247,62,0.3)" strokeWidth="1" />
        <line x1="32" y1="8" x2="8" y2="32" stroke="rgba(200,247,62,0.3)" strokeWidth="1" />
      </svg>
      <span>ERR: ASSET_MISSING</span>
      <span className="on-err-code">CODE: CLASSIFIED_PAYLOAD</span>
    </div>
  )
}

function Visual({ kind }: { kind: Project['visual'] }) {
  if (kind === 'chart') return <ChartViz />
  if (kind === 'graph') return <GraphViz />
  if (kind === 'terminal') return <TerminalViz />
  return <ErrViz />
}

export default function OnlineDashboard() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [counter, setCounter] = useState('01 / 04')

  useEffect(() => {
    const wrapper = wrapperRef.current
    const track = trackRef.current
    const header = headerRef.current
    if (!wrapper || !track || !header) return

    const headerIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) header.classList.add('in')
        })
      },
      { threshold: 0.2 }
    )
    headerIO.observe(header)

    const onScroll = () => {
      const isMobile = window.matchMedia('(max-width: 900px)').matches
      if (isMobile) {
        track.style.transform = ''
        return
      }

      const scrollY = window.scrollY
      const top = wrapper.offsetTop
      const h = wrapper.offsetHeight - window.innerHeight
      const p = Math.max(0, Math.min(1, (scrollY - top) / Math.max(1, h)))

      const trackW = track.scrollWidth
      const vw = window.innerWidth
      const maxX = -(trackW - vw + 160)
      track.style.transform = `translateX(${p * maxX}px)`

      const cardIdx = Math.min(3, Math.floor(p * 4))
      setCounter(String(cardIdx + 1).padStart(2, '0') + ' / 04')

      track.querySelectorAll<HTMLElement>('.on-proj-card').forEach((c, i) => {
        const dist = Math.abs(p * 4 - i)
        const bright = dist < 1 ? 1 : Math.max(0.5, 1 - (dist - 1) * 0.3)
        c.style.filter = `brightness(${bright})`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      headerIO.disconnect()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="on-dashboard-pin" data-on-section="1">
      <div className="on-dashboard-sticky">
        <div ref={headerRef} className="on-dashboard-header">
          <span className="on-dash-header-left">Selected</span>
          <span className="on-dash-header-right">Projects</span>
          <span className="on-dash-counter">{counter}</span>
        </div>
        <div className="on-dashboard-track-wrap">
          <div ref={trackRef} className="on-dashboard-track">
            {PROJECTS.map((p) => (
              <div key={p.id} className="on-proj-card">
                <div className="on-proj-titlebar">
                  <div className="on-win-dot on-win-dot-1" />
                  <div className="on-win-dot on-win-dot-2" />
                  <div className="on-win-dot on-win-dot-3" />
                  <span className="on-proj-titlebar-name">{p.branch}</span>
                </div>
                <div className="on-proj-body">
                  <div className="on-proj-text">
                    <div>
                      <div className="on-proj-index">{p.index}</div>
                      <div className="on-proj-name">{p.name}</div>
                      <div className="on-proj-desc">{p.desc}</div>
                      <div className="on-proj-tags">
                        {p.tags.map((t) => (
                          <span key={t} className="on-proj-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="on-proj-link"
                      >
                        VIEW ON GITHUB <span>↗</span>
                      </a>
                    ) : (
                      <span className="on-proj-link on-proj-link-disabled">
                        COMING SOON <span>→</span>
                      </span>
                    )}
                  </div>
                  <div className="on-proj-visual">
                    <div className="on-proj-visual-inner">
                      <Visual kind={p.visual} />
                    </div>
                    <div className="on-viz-label">{p.vizLabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
