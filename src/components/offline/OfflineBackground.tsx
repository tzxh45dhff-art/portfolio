import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  '01 / HERO',
  '02 / GALLERY',
  '03 / QUOTE',
  '04 / INTERESTS',
  '05 / SOCIALS',
  '06 / CTA',
]

export default function OfflineBackground() {
  const blobRef = useRef<HTMLDivElement>(null)
  const scanRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [labelIdx, setLabelIdx] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight)
      const progress = Math.min(1, scrollY / maxScroll)

      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`
      if (scanRef.current) scanRef.current.style.top = (scrollY % window.innerHeight) + 'px'

      const blob = blobRef.current
      if (blob) {
        blob.style.top = progress * 120 + 'vh'
        let r: number, g: number, b: number, a: number
        if (progress < 0.4) {
          const t = progress / 0.4
          r = Math.round(200 * (1 - t) + 62 * t)
          g = Math.round(247 * (1 - t) + 130 * t)
          b = Math.round(62 * (1 - t) + 247 * t)
          a = 0.07 - 0.02 * t
        } else {
          const t = (progress - 0.4) / 0.6
          r = Math.round(62 * (1 - t) + 180 * t)
          g = Math.round(130 * (1 - t) + 62 * t)
          b = Math.round(247 * (1 - t) + 247 * t)
          a = 0.05 - 0.01 * t
        }
        blob.style.background = `rgba(${r},${g},${b},${a})`
      }

      const sections = document.querySelectorAll<HTMLElement>('[data-off-section]')
      let active = 0
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top + scrollY
        if (scrollY >= top - window.innerHeight * 0.5) {
          active = parseInt(sec.dataset.offSection || '0', 10)
        }
      })
      setLabelIdx(active)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="off-bg-blob"><div ref={blobRef} className="off-bg-blob-inner" /></div>
      <div className="off-bg-noise" />
      <div ref={scanRef} className="off-bg-scanline" />
      <div className="off-scroll-progress"><div ref={fillRef} className="off-scroll-progress-fill" /></div>
      <div className="off-section-label">
        <span key={labelIdx} className="off-label-item">
          {SECTIONS[labelIdx] ?? SECTIONS[0]}
        </span>
      </div>
    </>
  )
}
