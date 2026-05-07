import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  { num: 'I',   label: 'Opening' },
  { num: 'II',  label: 'Frames' },
  { num: 'III', label: 'Reflection' },
  { num: 'IV',  label: 'Interiors' },
  { num: 'V',   label: 'Outwards' },
  { num: 'VI',  label: 'Closing' },
]

export default function OfflineBackground() {
  const blobARef = useRef<HTMLDivElement>(null)
  const blobBRef = useRef<HTMLDivElement>(null)
  const blobCRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [labelIdx, setLabelIdx] = useState(0)

  useEffect(() => {
    let raf = 0
    let targetY = 0
    let currentY = 0

    const onScroll = () => { targetY = window.scrollY }

    const tick = () => {
      // Inertial lerp — soft-follow the scroll for blob parallax
      currentY += (targetY - currentY) * 0.14
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight)
      const progress = Math.min(1, currentY / maxScroll)

      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`

      // Quieter, slower drift — feels like light moving through fog
      if (blobARef.current) blobARef.current.style.transform = `translate3d(${-12 + progress * 18}vw, ${4 + progress * 60}vh, 0)`
      if (blobBRef.current) blobBRef.current.style.transform = `translate3d(${42 - progress * 16}vw, ${22 + progress * 44}vh, 0)`
      if (blobCRef.current) blobCRef.current.style.transform = `translate3d(${14 + progress * 10}vw, ${56 - progress * 28}vh, 0)`

      const sections = document.querySelectorAll<HTMLElement>('[data-off-section]')
      let active = 0
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top + currentY
        if (currentY >= top - window.innerHeight * 0.5) {
          active = parseInt(sec.dataset.offSection || '0', 10)
        }
      })
      setLabelIdx((prev) => (prev !== active ? active : prev))

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

  const current = SECTIONS[labelIdx] ?? SECTIONS[0]

  return (
    <>
      <div className="off-bg-warm">
        <div ref={blobARef} className="off-blob off-blob-a" />
        <div ref={blobBRef} className="off-blob off-blob-b" />
        <div ref={blobCRef} className="off-blob off-blob-c" />
      </div>
      <div className="off-bg-grain" />
      <div className="off-bg-vignette" />

      <div className="off-scroll-progress">
        <div ref={fillRef} className="off-scroll-progress-fill" />
      </div>

      <div className="off-section-label">
        <span className="off-label-num">{current.num}</span>
        <span className="off-label-rule" />
        <span className="off-label-text">{current.label}</span>
      </div>
    </>
  )
}
