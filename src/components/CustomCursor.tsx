import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [variant, setVariant] = useState<'default' | 'link' | 'text' | 'click'>('default')

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2
    let cx = tx, cy = ty
    let raf = 0

    const loop = () => {
      cx += (tx - cx) * 0.22
      cy += (ty - cy) * 0.22
      wrap.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      const target = e.target as HTMLElement | null
      if (!target) return
      const link = target.closest('a, button, [data-cursor]') as HTMLElement | null
      if (link) {
        const cursorAttr = link.getAttribute('data-cursor')
        if (cursorAttr) setLabel(cursorAttr)
        else if (link.tagName === 'A' && (link as HTMLAnchorElement).href.includes('mailto:')) setLabel('Email')
        else if (link.tagName === 'A') setLabel('Visit')
        else setLabel('Click')
        setVariant('link')
      } else if (target.matches('input, textarea, [contenteditable="true"]')) {
        setVariant('text')
        setLabel('')
      } else {
        setVariant('default')
        setLabel('')
      }
    }
    const onDown = () => setVariant((v) => (v === 'link' ? 'link' : 'click'))
    const onUp = (e: MouseEvent) => onMove(e)
    const onLeave = () => { tx = -200; ty = -200 }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrapRef} className={`cursor-wrap ${variant}`}>
      <div className="cursor-ring" />
      <div className="cursor-dot" />
      <div className="cursor-label">{label}</div>
    </div>
  )
}
