import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  '01 / HERO',
  '02 / PROJECTS',
  '03 / STACK',
  '04 / COMMITS',
  '05 / CTA',
]

export default function OnlineBackground() {
  const fillRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [labelIdx, setLabelIdx] = useState(0)
  const [uptime, setUptime] = useState('UPTIME: 00:00:00:000')

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight)
      const progress = Math.min(1, scrollY / maxScroll)

      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`

      // Hero grid intensify (only during hero pin)
      const heroPin = document.querySelector<HTMLElement>('.on-hero-pin')
      if (gridRef.current && heroPin) {
        const heroH = heroPin.offsetHeight - window.innerHeight
        const heroP = Math.max(0, Math.min(1, scrollY / Math.max(1, heroH)))
        const opa = 0.03 + heroP * 0.07
        gridRef.current.style.backgroundImage =
          `linear-gradient(rgba(200,247,62,${opa}) 1px, transparent 1px),` +
          `linear-gradient(90deg, rgba(200,247,62,${opa}) 1px, transparent 1px)`
      }

      // Section counter
      const sections = document.querySelectorAll<HTMLElement>('[data-on-section]')
      let active = 0
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top + scrollY
        if (scrollY >= top - window.innerHeight * 0.5) {
          active = parseInt(sec.dataset.onSection || '0', 10)
        }
      })
      setLabelIdx(active)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Live uptime — interval, not RAF (battery-friendly)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const e = Date.now() - start
      const ms = e % 1000
      const s = Math.floor(e / 1000) % 60
      const m = Math.floor(e / 60000) % 60
      const h = Math.floor(e / 3600000)
      setUptime(
        'UPTIME: ' +
          String(h).padStart(2, '0') + ':' +
          String(m).padStart(2, '0') + ':' +
          String(s).padStart(2, '0') + ':' +
          String(ms).padStart(3, '0')
      )
    }
    tick()
    const id = setInterval(tick, 60)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <div ref={gridRef} className="on-bg-grid" />
      <div className="on-scanline" />
      <div className="on-progress-rail">
        <div ref={fillRef} className="on-progress-fill" />
      </div>
      <div className="on-uptime">{uptime}</div>
      <div className="on-sec-counter">{SECTIONS[labelIdx] ?? SECTIONS[0]}</div>
    </>
  )
}
