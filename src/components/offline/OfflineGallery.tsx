import { useEffect, useRef } from 'react'

const CARDS = [
  { w: 380, h: 560, n: '01', loc: 'Chandigarh', year: '2024', img: '/assets/gallery1.jpg' },
  { w: 320, h: 380, n: '02', loc: 'Delhi', year: '2024', img: '/assets/gallery2.jpg' },
  { w: 460, h: 560, n: '03', loc: 'Mumbai', year: '2023', img: '/assets/gallery3.jpg' },
  { w: 320, h: 380, n: '04', loc: 'Manali', year: '2024', img: '/assets/gallery4.jpg' },
  { w: 400, h: 560, n: '05', loc: 'Amritsar', year: '2023', img: '/assets/gallery5.jpg' },
  { w: 340, h: 380, n: '06', loc: 'Shimla', year: '2024', img: '/assets/gallery6.jpg' },
  { w: 440, h: 560, n: '07', loc: 'Jalandhar', year: '2025', img: '/assets/gallery7.jpg' },
  { w: 360, h: 380, n: '08', loc: 'Online', year: '2025', img: '/assets/gallery8.jpg' },
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
