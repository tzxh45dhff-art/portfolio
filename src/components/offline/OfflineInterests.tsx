import { useEffect, useRef } from 'react'
import { movies } from '../../data'

const WAVE_HEIGHTS = [10, 18, 14, 22, 12, 26, 16, 20, 14, 24, 18, 20, 12, 22, 16]

const READING = [
  { title: 'The Psychology of Money',  author: 'Morgan Housel',     spine: 'b1' },
  { title: 'Show Your Work',           author: 'Austin Kleon',      spine: 'b2' },
  { title: 'Zero to One',              author: 'Peter Thiel',       spine: 'b3' },
]

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
              setTimeout(() => item.classList.add('visible'), i * 180 + 240)
            })
          }
          if (e.target.classList.contains('off-books-visual')) {
            const s1 = root.querySelector<HTMLElement>('.off-book-spine.b1')
            const s2 = root.querySelector<HTMLElement>('.off-book-spine.b2')
            const s3 = root.querySelector<HTMLElement>('.off-book-spine.b3')
            if (s1) {
              s1.style.transition = 'transform 1.4s var(--ease-expo)'
              s1.style.transform = 'translateX(-44px) translateY(2px) rotate(-9deg)'
            }
            if (s2) {
              s2.style.transition = 'transform 1.4s 0.18s var(--ease-expo)'
              s2.style.transform = 'translateY(0px) rotate(0deg)'
            }
            if (s3) {
              s3.style.transition = 'transform 1.4s 0.36s var(--ease-expo)'
              s3.style.transform = 'translateX(44px) translateY(2px) rotate(9deg)'
            }
          }
          if (e.target.classList.contains('off-cinema-grid')) {
            root.querySelectorAll<HTMLElement>('.off-cinema-card').forEach((card, i) => {
              setTimeout(() => {
                card.style.transition = 'opacity 1s var(--ease-expo), transform 1.2s var(--ease-expo)'
                card.style.opacity = '1'
                card.style.transform = 'translate(0,0)'
              }, i * 140)
            })
          }
        })
      },
      { threshold: 0.18, rootMargin: '-80px' }
    )

    root
      .querySelectorAll(
        '.off-fm-up, .off-fm-left, .off-fm-right, .off-section-header, .off-section-hr, .off-block-divider, .off-reading-anchor, .off-books-visual, .off-cinema-grid'
      )
      .forEach((el) => io.observe(el))

    // Cinema cards: subtle stagger from natural cinematic positions
    const deltas: Array<[number, number]> = [
      [-40, 30],
      [40, -30],
      [-30, -40],
      [30, 40],
    ]
    root.querySelectorAll<HTMLElement>('.off-cinema-card').forEach((card, i) => {
      const d = deltas[i] || [0, 0]
      card.style.transform = `translate(${d[0]}px,${d[1]}px)`
      card.style.opacity = '0'
    })

    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="off-interests-section" data-off-section="3">
      <div className="off-section-header">
        <span className="off-section-header-eyebrow">IV — Interiors</span>
        <span className="off-section-header-title">A few preoccupations</span>
        <span className="off-section-header-sub">Things that hold attention when no one's looking.</span>
      </div>
      <div className="off-section-hr" />

      {/* I — MUSIC */}
      <div className="off-interest-block">
        <div className="off-block-counter">01 / IV</div>
        <div className="off-block-two-col">
          <div className="off-block-text-content off-fm-up">
            <div className="off-block-eyebrow">Sound</div>
            <h3 className="off-block-title">Between the headphones</h3>
            <p className="off-block-body">
              Late nights, repeat plays, lyrics that turn into architecture. Mostly Kanye, Travis, Kendrick — production as language. Music isn't a backdrop here; it's the room I work inside.
            </p>
            <div className="off-block-meta-row">
              <span>Now playing</span>
              <span className="off-block-meta-rule" />
              <span>Stronger — Kanye West</span>
            </div>
          </div>

          <div className="off-block-image-wrap off-fm-right" style={{ minHeight: 232 }}>
            <iframe
              style={{ borderRadius: 2, border: 'none', width: '100%', height: 232 }}
              src="https://open.spotify.com/embed/track/4fzsfWzRhPawzqhX8Qt9F3?utm_source=generator&theme=0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Stronger — Kanye West"
            />
            <div className="off-waveform" aria-hidden>
              {WAVE_HEIGHTS.map((h, i) => {
                const from = Math.max(4, h * 0.45)
                return (
                  <div
                    key={i}
                    className="off-wave-bar"
                    style={
                      {
                        ['--h-from' as string]: `${from}px`,
                        ['--h-to' as string]: `${h}px`,
                        height: `${from}px`,
                        animationDelay: `${i * 0.08}s`,
                        animationDuration: `${1.4 + (i % 5) * 0.18}s`,
                      } as React.CSSProperties
                    }
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="off-block-divider" />

      {/* II — MOVEMENT (formerly basketball — cinematic court) */}
      <div className="off-interest-block">
        <div className="off-block-counter">02 / IV</div>
        <div className="off-block-two-col reversed">
          <div className="off-block-image-wrap off-fm-left">
            <div className="off-court-frame">
              <div className="off-court-spotlight" />
              <div className="off-court-lines" aria-hidden>
                <span className="off-court-arc" />
                <span className="off-court-line off-court-line-h" />
                <span className="off-court-line off-court-line-v" />
                <span className="off-court-key" />
              </div>
              <div className="off-court-grain" aria-hidden />
              <div className="off-court-overlay">
                <span className="off-court-tag">No. 23</span>
                <span className="off-court-quote">
                  &ldquo;Talent wins games. Quiet repetition wins seasons.&rdquo;
                </span>
              </div>
            </div>
          </div>
          <div className="off-block-text-content off-fm-up">
            <div className="off-block-eyebrow">Movement</div>
            <h3 className="off-block-title">A court at dusk</h3>
            <p className="off-block-body">
              Basketball as flow state. The half-second before the release. Reading defenders without thinking. The discipline isn't the highlight — it's the thousand boring repetitions that make the highlight inevitable.
            </p>
            <div className="off-block-meta-row">
              <span>Where</span>
              <span className="off-block-meta-rule" />
              <span>Jalandhar · 2024 →</span>
            </div>
          </div>
        </div>
      </div>
      <div className="off-block-divider" />

      {/* III — PAGES (books) */}
      <div className="off-interest-block">
        <div className="off-block-counter">03 / IV</div>
        <div className="off-block-centered">
          <div className="off-block-eyebrow">Pages</div>
          <h3 className="off-block-title off-block-title-center">The reading stack</h3>
          <div className="off-books-visual" aria-hidden>
            {READING.map((b) => (
              <div key={b.spine} className={`off-book-spine ${b.spine}`}>
                <span className="off-book-title">{b.title}</span>
              </div>
            ))}
            <div className="off-books-shelf" />
          </div>
          <p className="off-block-body off-block-body-center">
            Three books that quietly rearranged how I think about money, attention, and beginning.
          </p>
          <ul className="off-reading-list off-reading-anchor">
            {READING.map((b) => (
              <li key={b.title} className="off-reading-item">
                <span className="off-reading-title">{b.title}</span>
                <span className="off-reading-rule" />
                <span className="off-reading-author">{b.author}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="off-block-divider" />

      {/* IV — CINEMA (movies) */}
      <div className="off-interest-block">
        <div className="off-block-counter">04 / IV</div>
        <div className="off-block-cinema-layout">
          <div className="off-fm-up">
            <div className="off-block-eyebrow">Cinema</div>
            <h3 className="off-block-title">Frames that stayed</h3>
            <p className="off-block-body">
              Films aren't lists. They're rooms I keep returning to — for a single shot, a single piece of score, a single line that re-enters the mind ten years later.
            </p>
            <div className="off-block-meta-row">
              <span>Reels</span>
              <span className="off-block-meta-rule" />
              <span>Selected · 2008 → 2019</span>
            </div>
          </div>
          <div className="off-cinema-grid">
            {movies.map((m, i) => (
              <figure key={m.title} className="off-cinema-card">
                <img src={m.poster} alt={m.title} className="off-cinema-card-img" />
                <div className="off-cinema-card-shade" />
                <figcaption className="off-cinema-card-caption">
                  <span className="off-cinema-card-num">0{i + 1}</span>
                  <span className="off-cinema-card-title">{m.title}</span>
                  <span className="off-cinema-card-year">{m.year}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
