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
  const auroraARef = useRef<HTMLDivElement>(null)
  const auroraBRef = useRef<HTMLDivElement>(null)
  const auroraCRef = useRef<HTMLDivElement>(null)
  const [labelIdx, setLabelIdx] = useState(0)
  const [uptime, setUptime] = useState('UPTIME: 00:00:00:000')

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight)
      const progress = Math.min(1, scrollY / maxScroll)

      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`

      if (auroraARef.current) auroraARef.current.style.transform = `translate3d(${-15 + progress * 25}vw, ${-10 + progress * 60}vh, 0)`
      if (auroraBRef.current) auroraBRef.current.style.transform = `translate3d(${60 - progress * 30}vw, ${20 + progress * 50}vh, 0)`
      if (auroraCRef.current) auroraCRef.current.style.transform = `translate3d(${10 + progress * 20}vw, ${70 - progress * 40}vh, 0)`

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
      <div className="on-bg-aurora">
        <div ref={auroraARef} className="on-aurora on-aurora-a" />
        <div ref={auroraBRef} className="on-aurora on-aurora-b" />
        <div ref={auroraCRef} className="on-aurora on-aurora-c" />
      </div>
      <div className="on-bg-grid" />
      <div className="on-bg-vignette" />
      <div className="on-scanline" />
      <div className="on-progress-rail">
        <div ref={fillRef} className="on-progress-fill" />
      </div>
      <div className="on-uptime">{uptime}</div>
      <div className="on-sec-counter">{SECTIONS[labelIdx] ?? SECTIONS[0]}</div>
    </>
  )
}
