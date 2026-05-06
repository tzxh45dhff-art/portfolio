import { useEffect, useRef } from 'react'

type Proto = {
  name: string
  issuer: string
  year: string
  cat: 'cloud' | 'ai' | 'web' | 'lang'
  catLabel: 'CLOUD' | 'AI/ML' | 'WEB' | 'LANG'
}

type Record = {
  id: string
  event: string
  rank: string
  pool: string
  project: string
  desc: string
  tags: string[]
  year: string
}

const PROTOCOLS: Proto[] = [
  { name: 'Azure AI Fundamentals',     issuer: 'Microsoft',          year: '2024', cat: 'cloud', catLabel: 'CLOUD' },
  { name: 'Frontend Engineering',      issuer: 'Meta',               year: '2024', cat: 'web',   catLabel: 'WEB'   },
  { name: 'Python Professional',       issuer: 'Infosys Springboard',year: '2024', cat: 'lang',  catLabel: 'LANG'  },
  { name: 'HTML5 Application Dev',     issuer: 'Infosys Springboard',year: '2023', cat: 'web',   catLabel: 'WEB'   },
  { name: 'AI Foundations',            issuer: 'IBM',                year: '2024', cat: 'ai',    catLabel: 'AI/ML' },
  { name: 'AI for Disaster Mgmt.',     issuer: 'Coursera',           year: '2024', cat: 'ai',    catLabel: 'AI/ML' },
]

const RECORDS: Record[] = [
  {
    id: 'hackhelix',
    event: 'CGC HackHelix',
    rank: 'TOP 7',
    pool: '450+ TEAMS',
    project: 'MINDPOP',
    desc: 'Mental wellness platform combining real-time sentiment analysis with adaptive intervention flows. Built end-to-end in 36 hours.',
    tags: ['REACT', 'NODE', 'NLP', 'FIREBASE'],
    year: '2024',
  },
  {
    id: 'finvasia',
    event: 'Finvasia Hackathon',
    rank: 'TOP 30',
    pool: '200+ TEAMS',
    project: 'KINETIC',
    desc: 'Fintech motion-capture pipeline feeding a local LLM for trader-action classification. Sub-20ms inference on Apple Silicon.',
    tags: ['PYTHON', 'MLX', 'COREML', 'FASTAPI'],
    year: '2024',
  },
]

export default function OnlineSystems() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const r = root.current
    if (!r) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement
            const idx = Number(t.dataset.idx || 0)
            setTimeout(() => t.classList.add('in'), idx * 50)
            io.unobserve(t)
          }
        })
      },
      { threshold: 0.15 }
    )
    r.querySelectorAll<HTMLElement>('.on-proto-row:not(.head), .on-record').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={root} className="on-section" data-on-section="3" data-on-id="systems">
      <header className="on-section-head">
        <div>
          <div className="on-sh-id">04 · SYSTEMS</div>
          <h2 className="on-sh-title">
            Verified protocols <em>&amp; field records</em>
          </h2>
        </div>
        <div className="on-sh-meta">
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">PROTOCOLS</span>
            <span className="on-sh-meta-val">{String(PROTOCOLS.length).padStart(2, '0')} · CLEARED</span>
          </div>
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">RECORDS</span>
            <span className="on-sh-meta-val">{String(RECORDS.length).padStart(2, '0')} · RANKED</span>
          </div>
          <div className="on-sh-meta-row">
            <span className="on-sh-meta-key">VERIFICATION</span>
            <span className="on-sh-meta-val">PUBLIC · ON-CHAIN</span>
          </div>
        </div>
      </header>

      <div className="on-systems">
        <div className="on-proto">
          <div className="on-proto-row head">
            <span>#</span>
            <span>PROTOCOL</span>
            <span>ISSUER</span>
            <span>CATEGORY</span>
            <span>YEAR</span>
          </div>
          {PROTOCOLS.map((p, i) => (
            <div key={p.name} className="on-proto-row" data-idx={i}>
              <span className="on-proto-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="on-proto-name">{p.name}</span>
              <span className="on-proto-issuer">{p.issuer}</span>
              <span className={`on-proto-cat ${p.cat}`}>{p.catLabel}</span>
              <span className="on-proto-year">{p.year}</span>
            </div>
          ))}
        </div>

        <div className="on-records">
          {RECORDS.map((r, i) => (
            <article key={r.id} className="on-record" data-idx={i}>
              <header className="on-record-head">
                <span>FIELD · RECORD / {String(i + 1).padStart(2, '0')}</span>
                <span>{r.year}</span>
              </header>
              <div className="on-record-name">{r.event}</div>
              <div className="on-record-stats">
                <div className="on-record-stat">
                  <span className="on-record-num">{r.rank}</span>
                  <span className="on-record-num-label">PLACEMENT</span>
                </div>
                <div className="on-record-stat">
                  <span className="on-record-num">{r.pool}</span>
                  <span className="on-record-num-label">FIELD · SIZE</span>
                </div>
              </div>
              <p className="on-record-desc">
                <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>{r.project}</strong> — {r.desc}
              </p>
              <div className="on-record-tags">
                {r.tags.map((t) => (
                  <span key={t} className="on-record-tag">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
