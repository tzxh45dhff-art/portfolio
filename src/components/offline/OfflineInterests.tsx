import { useEffect, useRef } from 'react'

const WAVE_HEIGHTS = [14, 28, 20, 36, 16, 44, 22, 34, 18, 40, 26, 32, 12, 38, 24, 30, 16, 42, 20, 28]

export default function OfflineInterests() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('in-view')

          if (e.target.classList.contains('off-reading-anchor')) {
            root.querySelectorAll('.off-reading-item').forEach((item, i) => {
              setTimeout(() => item.classList.add('visible'), i * 120 + 200)
            })
          }
          if (e.target.classList.contains('off-books-visual')) {
            const s1 = root.querySelector<HTMLElement>('.off-book-spine.b1')
            const s2 = root.querySelector<HTMLElement>('.off-book-spine.b2')
            const s3 = root.querySelector<HTMLElement>('.off-book-spine.b3')
            if (s1) {
              s1.style.transition = 'transform 0.8s var(--ease-expo)'
              s1.style.transform = 'translateX(-35px) rotate(-15deg)'
            }
            if (s2) {
              s2.style.transition = 'transform 0.8s 0.1s var(--ease-expo)'
              s2.style.transform = 'translateY(0px) rotate(0deg)'
            }
            if (s3) {
              s3.style.transition = 'transform 0.8s 0.2s var(--ease-expo)'
              s3.style.transform = 'translateX(35px) rotate(15deg)'
            }
          }
          if (e.target.classList.contains('off-design-grid')) {
            root.querySelectorAll<HTMLElement>('.off-design-card').forEach((card, i) => {
              setTimeout(() => {
                card.style.transition = 'opacity 0.6s var(--ease-expo), transform 0.6s var(--ease-expo)'
                card.style.opacity = '1'
                card.style.transform = 'translate(0,0)'
              }, i * 100)
            })
          }
        })
      },
      { threshold: 0.15, rootMargin: '-60px' }
    )

    root
      .querySelectorAll(
        '.off-fm-up, .off-fm-left, .off-fm-right, .off-section-header, .off-section-hr, .off-block-divider, .off-reading-anchor, .off-books-visual, .off-design-grid'
      )
      .forEach((el) => io.observe(el))

    const deltas: Array<[number, number]> = [
      [-60, -60],
      [60, -60],
      [-60, 60],
      [60, 60],
    ]
    root.querySelectorAll<HTMLElement>('.off-design-card').forEach((card, i) => {
      const d = deltas[i] || [0, 0]
      card.style.transform = `translate(${d[0]}px,${d[1]}px)`
      card.style.opacity = '0'
    })

    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="off-interests-section" data-off-section="3">
      <div className="off-section-header">
        <span className="off-section-header-left">Personal</span>
        <span className="off-section-header-right">Interests</span>
      </div>
      <div className="off-section-hr" />

      {/* MUSIC */}
      <div className="off-interest-block">
        <div className="off-block-two-col">
          <div className="off-block-image-wrap off-fm-left">
            <div className="off-block-image-placeholder">♪</div>
            <div className="off-waveform">
              {WAVE_HEIGHTS.map((h, i) => {
                const from = Math.max(6, h * 0.4)
                return (
                  <div
                    key={i}
                    className="off-wave-bar"
                    style={
                      {
                        ['--h-from' as string]: `${from}px`,
                        ['--h-to' as string]: `${h}px`,
                        height: `${from}px`,
                        animationDelay: `${i * 0.06}s`,
                        animationDuration: `${0.6 + (i % 5) * 0.12}s`,
                      } as React.CSSProperties
                    }
                  />
                )
              })}
            </div>
          </div>
          <div className="off-fm-up" style={{ transitionDelay: '0.1s' }}>
            <div className="off-block-num">01</div>
            <div className="off-block-title">Between the Headphones</div>
            <div className="off-block-body">Frank Ocean. Tyler. Kendrick. Music as architecture.</div>
            <div className="off-block-tag">Always · Late Night</div>
            <div className="off-block-pill">LISTENING</div>
          </div>
        </div>
      </div>
      <div className="off-block-divider" />

      {/* CHESS */}
      <div className="off-interest-block" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="off-block-giant-num">02</div>
        <div className="off-block-two-col reversed">
          <div className="off-block-image-wrap off-fm-right" style={{ position: 'relative' }}>
            <div className="off-block-image-placeholder">♟</div>
          </div>
          <div className="off-block-text-content off-fm-up" style={{ transitionDelay: '0.1s' }}>
            <div className="off-block-num">02</div>
            <div className="off-block-title">Thinking Ahead</div>
            <div className="off-block-body">Chess as strategy. Every move is a system.</div>
            <div className="off-block-tag">Jalandhar · 2024</div>
            <div className="off-block-pill">STRATEGY</div>
          </div>
        </div>
      </div>
      <div className="off-block-divider" />

      {/* BOOKS */}
      <div className="off-interest-block">
        <div className="off-block-centered off-fm-up">
          <div className="off-books-visual">
            <div className="off-book-spine b1"><span className="off-book-title">Psychology of Money</span></div>
            <div className="off-book-spine b2"><span className="off-book-title">Show Your Work</span></div>
            <div className="off-book-spine b3"><span className="off-book-title">Zero to One</span></div>
          </div>
          <div className="off-block-num">03</div>
          <div className="off-block-title" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>
            <em>The Reading Stack</em>
          </div>
          <div className="off-block-body">Books that rewire how you see money, systems, and people.</div>
          <ul className="off-reading-list off-reading-anchor" style={{ marginTop: 24 }}>
            <li className="off-reading-item">The Psychology of Money</li>
            <li className="off-reading-item">Show Your Work</li>
            <li className="off-reading-item">Zero to One</li>
          </ul>
        </div>
      </div>
      <div className="off-block-divider" />

      {/* DESIGN + FILM */}
      <div className="off-interest-block">
        <div className="off-block-design-layout">
          <div className="off-fm-up">
            <div className="off-block-num">04</div>
            <div className="off-block-title">Visual Thinking</div>
            <div className="off-block-body">
              Design as language. The aesthetic of a thing matters as much as its function.
            </div>
            <div className="off-block-pill" style={{ marginTop: 16 }}>DESIGN + FILM</div>
          </div>
          <div className="off-design-grid">
            {['FRAME 01', 'FRAME 02', 'FRAME 03', 'FRAME 04'].map((label) => (
              <div key={label} className="off-design-card">
                <div className="off-design-card-placeholder">{label}</div>
                <div className="off-design-card-overlay" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
