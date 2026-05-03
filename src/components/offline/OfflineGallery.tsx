import { useEffect, useRef } from 'react'

const CARDS = [
  { w: 340, h: 520, n: '01', cap: 'Chandigarh · 2024', img: '/assets/gallery-01.jpg' },
  { w: 300, h: 340, n: '02', cap: 'Delhi · 2024', img: '/assets/gallery-02.jpg' },
  { w: 420, h: 520, n: '03', cap: 'Mumbai · 2023', img: '/assets/gallery-03.jpg' },
  { w: 300, h: 340, n: '04', cap: 'Manali · 2024', img: '/assets/gallery-04.jpg' },
  { w: 360, h: 520, n: '05', cap: 'Amritsar · 2023', img: '/assets/gallery-05.jpg' },
  { w: 320, h: 340, n: '06', cap: 'Shimla · 2024', img: '/assets/gallery-06.jpg' },
  { w: 400, h: 520, n: '07', cap: 'Jalandhar · 2025', img: '/assets/gallery-07.jpg' },
  { w: 340, h: 340, n: '08', cap: 'Online · 2025', img: '/assets/gallery-08.jpg' },
]

export default function OfflineGallery() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const track = trackRef.current
    if (!wrapper || !track) return

    const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const onScroll = () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        track.style.transform = ''
        return
      }
      const scrollY = window.scrollY
      const top = wrapper.offsetTop
      const h = wrapper.offsetHeight - window.innerHeight
      const p = clamp((scrollY - top) / Math.max(1, h), 0, 1)

      const trackWidth = track.scrollWidth
      const viewWidth = window.innerWidth
      const maxTranslate = -(trackWidth - viewWidth + 160)
      track.style.transform = `translateX(${p * maxTranslate}px)`

      track.querySelectorAll<HTMLElement>('.off-gallery-card').forEach((card, i) => {
        const cardP = clamp((p - i * 0.07) / 0.2, 0, 1)
        const e = easeOut(cardP)
        card.style.transform = `scale(${lerp(0.88, 1, e)}) rotateY(${lerp(8, 0, e)}deg)`
        card.style.filter = `brightness(${lerp(0.4, 1, e)})`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} className="off-gallery-pin" data-off-section="1">
      <div className="off-gallery-sticky">
        <div className="off-gallery-edge-left" />
        <div className="off-gallery-edge-right" />
        <div ref={trackRef} className="off-gallery-track">
          {CARDS.map((c) => (
            <div key={c.n} className="off-gallery-card" style={{ width: c.w, height: c.h }}>
              <img src={c.img} alt={c.cap} className="off-gallery-card-img" />
              <div className="off-gallery-caption">{c.cap}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
