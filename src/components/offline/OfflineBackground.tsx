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
  const blobARef = useRef<HTMLDivElement>(null)
  const blobBRef = useRef<HTMLDivElement>(null)
  const blobCRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [labelIdx, setLabelIdx] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight)
      const progress = Math.min(1, scrollY / maxScroll)

      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`

      // Drift blobs slowly with scroll for parallax
      if (blobARef.current) blobARef.current.style.transform = `translate(${-20 + progress * 30}vw, ${10 + progress * 80}vh)`
      if (blobBRef.current) blobBRef.current.style.transform = `translate(${50 - progress * 25}vw, ${30 + progress * 60}vh)`
      if (blobCRef.current) blobCRef.current.style.transform = `translate(${20 + progress * 15}vw, ${70 - progress * 40}vh)`

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
      <div className="off-bg-warm">
        <div ref={blobARef} className="off-blob off-blob-a" />
        <div ref={blobBRef} className="off-blob off-blob-b" />
        <div ref={blobCRef} className="off-blob off-blob-c" />
      </div>
      <div className="off-bg-noise" />
      <div className="off-bg-vignette" />
      <div className="off-scroll-progress"><div ref={fillRef} className="off-scroll-progress-fill" /></div>
      <div className="off-section-label">
        <span key={labelIdx} className="off-label-item">
          {SECTIONS[labelIdx] ?? SECTIONS[0]}
        </span>
      </div>
    </>
  )
}
