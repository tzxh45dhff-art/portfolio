import { useEffect, useRef } from 'react'

type Cert = {
  name: string
  issuer: string
  year: string
  code: string
  category: 'CLOUD' | 'AI/ML' | 'WEB' | 'LANG'
}

type Competition = {
  id: string
  event: string
  rank: string
  pool: string
  project: string
  desc: string
  tags: string[]
  year: string
}

const CERTS: Cert[] = [
  { name: 'Azure AI Fundamentals', issuer: 'Microsoft', year: '2024', code: 'AI-900', category: 'CLOUD' },
  { name: 'Frontend Engineering', issuer: 'Meta', year: '2024', code: 'META-FE', category: 'WEB' },
  { name: 'Python Pro', issuer: 'Infosys', year: '2024', code: 'INF-PY', category: 'LANG' },
  { name: 'HTML5 Certified', issuer: 'Infosys', year: '2023', code: 'INF-HTML5', category: 'WEB' },
  { name: 'AI Basics', issuer: 'IBM', year: '2024', code: 'IBM-AI', category: 'AI/ML' },
  { name: 'Disaster AI', issuer: 'Coursera', year: '2024', code: 'CRS-DAI', category: 'AI/ML' },
]

const COMPETITIONS: Competition[] = [
  {
    id: 'hackhelix',
    event: 'CGC HackHelix',
    rank: 'TOP 7',
    pool: '450+ TEAMS',
    project: 'MINDPOP',
    desc: 'Mental wellness platform combining real-time sentiment analysis with adaptive intervention flows. Built end-to-end in 36 hours.',
    tags: ['React', 'Node', 'NLP', 'Firebase'],
    year: '2024',
  },
  {
    id: 'finvasia',
    event: 'Finvasia Hackathon',
    rank: 'TOP 30',
    pool: '200+ TEAMS',
    project: 'KINETIC',
    desc: 'Fintech motion-capture pipeline feeding a local LLM for trader-action classification. Sub-20ms inference on Apple Silicon.',
    tags: ['Python', 'MLX', 'CoreML', 'FastAPI'],
    year: '2024',
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
      { threshold: 0.15, rootMargin: '-40px' }
    )
    root.querySelectorAll('.on-cert-row, .on-comp-card, .on-creds-block-header').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="on-stack-section on-creds-section" data-on-section="2">
      <div className="on-creds-inner">
        <div className="on-creds-header">
          <span className="on-stack-big-left">CREDENTIALS</span>
          <span className="on-stack-big-right">&amp; WINS</span>
          <p className="on-stack-sub">Verified · Public Record</p>
        </div>

        {/* CERTIFICATIONS */}
        <div className="on-creds-block">
          <div className="on-creds-block-header">
            <div className="on-cat-ping" />
            <span className="on-creds-block-label">CERTIFICATIONS · {CERTS.length} ISSUED</span>
            <span className="on-ship-rule" />
            <span className="on-creds-meta">VERIFIED</span>
          </div>

          <div className="on-cert-table">
            <div className="on-cert-table-head">
              <span>#</span>
              <span>CERTIFICATION</span>
              <span>ISSUER</span>
              <span>CATEGORY</span>
              <span>YEAR</span>
              <span>CODE</span>
            </div>
            {CERTS.map((c, i) => (
              <div key={c.code} className="on-cert-row" style={{ transitionDelay: `${i * 0.06}s` }}>
                <span className="on-cert-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="on-cert-name">{c.name}</span>
                <span className="on-cert-issuer">{c.issuer}</span>
                <span className={`on-cert-cat on-cert-cat-${c.category.toLowerCase().replace('/', '-')}`}>
                  {c.category}
                </span>
                <span className="on-cert-year">{c.year}</span>
                <span className="on-cert-code">{c.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COMPETITIONS */}
        <div className="on-creds-block">
          <div className="on-creds-block-header">
            <div className="on-cat-ping" />
            <span className="on-creds-block-label">COMPETITIONS · {COMPETITIONS.length} PLACED</span>
            <span className="on-ship-rule" />
            <span className="on-creds-meta">RANKED</span>
          </div>

          <div className="on-comp-grid">
            {COMPETITIONS.map((c, i) => (
              <div key={c.id} className="on-comp-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="on-comp-titlebar">
                  <div className="on-win-dot on-win-dot-1" />
                  <div className="on-win-dot on-win-dot-2" />
                  <div className="on-win-dot on-win-dot-3" />
                  <span className="on-comp-titlebar-name">{c.id} — finalist/{c.year}</span>
                </div>
                <div className="on-comp-body">
                  <div className="on-comp-meta">
                    <span className="on-comp-event">{c.event}</span>
                    <span className="on-comp-year">{c.year}</span>
                  </div>
                  <div className="on-comp-rank-row">
                    <div className="on-comp-rank">
                      <span className="on-comp-rank-num">{c.rank}</span>
                      <span className="on-comp-rank-label">FINISH</span>
                    </div>
                    <div className="on-comp-divider" />
                    <div className="on-comp-rank">
                      <span className="on-comp-rank-num">{c.pool}</span>
                      <span className="on-comp-rank-label">FIELD</span>
                    </div>
                  </div>
                  <div className="on-comp-project-line">
                    <span className="on-comp-project-label">PROJECT</span>
                    <span className="on-comp-project-name">{c.project}</span>
                  </div>
                  <p className="on-comp-desc">{c.desc}</p>
                  <div className="on-comp-tags">
                    {c.tags.map((t) => (
                      <span key={t} className="on-comp-tag">{t}</span>
                    ))}
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
