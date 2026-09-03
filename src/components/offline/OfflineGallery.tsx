import { useEffect, useRef } from 'react'

/*
 * Four frames, because four is what actually exists.
 *
 * This list previously referenced /assets/gallery1..8.jpg — six of those files
 * do not exist (404) and gallery1.jpg was a 69MB TIFF mislabelled .jpg, which
 * no browser can decode. So the gallery was mostly broken images.
 *
 * Captions now describe what is genuinely in each frame rather than asserting
 * a city. The originals claimed Chandigarh / Delhi / Mumbai / Manali /
 * Amritsar / Shimla, which the photographs do not show.
 */
const CARDS = [
  { w: 440, h: 560, n: '01', loc: 'Volunteering', year: '2025', img: '/media/reel-1.jpg' },
  { w: 320, h: 560, n: '02', loc: 'Courtside',    year: '2024', img: '/media/offline.jpg' },
  { w: 420, h: 560, n: '03', loc: 'Off the clock', year: '2024', img: '/media/reel-3.jpg' },
  { w: 300, h: 560, n: '04', loc: 'Field notes',  year: '2025', img: '/media/reel-2.jpg' },
]

export default function OfflineGallery() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  // Manual offset added on top of scroll-driven target. Lives in 0..1 space.
  const manualOffsetRef = useRef(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const track = trackRef.current
    if (!wrapper || !track) return

    const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    let raf = 0
    let scrollTarget = 0
    let current = 0

    const onScroll = () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        track.style.transform = ''
        return
      }
      const scrollY = window.scrollY
      const vh = window.innerHeight
      const top = wrapper.offsetTop
      const sectionH = wrapper.offsetHeight
      // Start when 1/4 of the section is visible.
      const start = top - vh + sectionH * 0.25
      const end = top + sectionH - vh
      scrollTarget = clamp((scrollY - start) / Math.max(1, end - start), 0, 1)
    }

    const tick = () => {
      const target = clamp(scrollTarget + manualOffsetRef.current, 0, 1)
      // Tight tracking — small inertia just to smooth motion
      current += (target - current) * 0.18
      const trackWidth = track.scrollWidth
      const viewWidth = window.innerWidth
      const maxTranslate = -(trackWidth - viewWidth + 80)
      track.style.transform = `translate3d(${current * maxTranslate}px, 0, 0)`

      const cards = track.querySelectorAll<HTMLElement>('.off-gallery-card')
      let activeIdx = 0
      let bestDist = Infinity
      const center = window.innerWidth / 2
      cards.forEach((card, i) => {
        const cardP = clamp((current - i * 0.06) / 0.22, 0, 1)
        const e = easeOut(cardP)
        card.style.transform = `scale(${lerp(0.96, 1, e)})`
        card.style.filter = `brightness(${lerp(0.78, 1, e)}) saturate(${lerp(0.85, 1, e)})`

        const rect = card.getBoundingClientRect()
        const cardCenter = rect.left + rect.width / 2
        const d = Math.abs(cardCenter - center)
        if (d < bestDist) { bestDist = d; activeIdx = i }
      })

      if (counterRef.current) {
        counterRef.current.textContent = String(activeIdx + 1).padStart(2, '0')
      }

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Manual horizontal nav — does NOT move the page vertically.
  // Adjusts a manual offset that's added to the scroll-driven target,
  // clamped so combined target stays in 0..1.
  const stepBy = (dir: 1 | -1) => {
    const step = 1 / CARDS.length
    manualOffsetRef.current = manualOffsetRef.current + dir * step
    // Don't let manual offset push combined target outside 0..1 in a way
    // that creates "stuck" feeling — clamp roughly.
    manualOffsetRef.current = Math.max(-1, Math.min(1, manualOffsetRef.current))
  }

  return (
    <div ref={wrapperRef} className="off-gallery-pin" data-off-section="1">
      <div className="off-gallery-sticky">
        <div className="off-gallery-edge-left" />
        <div className="off-gallery-edge-right" />

        <div className="off-gallery-meta">
          <span className="off-gallery-meta-key">Frame</span>
          <span ref={counterRef} className="off-gallery-meta-num">01</span>
          <span className="off-gallery-meta-rule" />
          <span className="off-gallery-meta-key">of {String(CARDS.length).padStart(2, '0')}</span>
        </div>

        <div ref={trackRef} className="off-gallery-track">
          {CARDS.map((c) => (
            <figure
              key={c.n}
              className="off-gallery-card"
              style={{ width: c.w, height: c.h }}
            >
              <img src={c.img} alt={`${c.loc}, ${c.year}`} className="off-gallery-card-img" />
              <figcaption className="off-gallery-caption">
                <span className="off-gallery-cap-num">{c.n}</span>
                <span className="off-gallery-cap-loc">{c.loc}</span>
                <span className="off-gallery-cap-year">{c.year}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <button
          className="off-gallery-nav off-gallery-nav-prev"
          onClick={() => stepBy(-1)}
          aria-label="Previous frame"
          type="button"
        >
          <span className="off-gallery-nav-arrow">←</span>
        </button>
        <button
          className="off-gallery-nav off-gallery-nav-next"
          onClick={() => stepBy(1)}
          aria-label="Next frame"
          type="button"
        >
          <span className="off-gallery-nav-arrow">→</span>
        </button>

        <div className="off-gallery-footer">
          <span>Selected fragments — 2023 / 2025</span>
        </div>
      </div>
    </div>
  )
}
