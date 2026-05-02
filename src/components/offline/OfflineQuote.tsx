import { useEffect, useRef } from 'react'

const QUOTE = "Start small. Ship daily. The hours you put in when no one's watching are the ones that define where you end up."

export default function OfflineQuote() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)
  const attrRef = useRef<HTMLDivElement>(null)
  const words = QUOTE.split(' ')

  useEffect(() => {
    const section = sectionRef.current
    const wordsEl = wordsRef.current
    const attr = attrRef.current
    if (!section || !wordsEl || !attr) return

    const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))
    const wordSpans = wordsEl.querySelectorAll<HTMLElement>('.off-word')

    const onScroll = () => {
      const scrollY = window.scrollY
      const top = section.offsetTop
      const h = section.offsetHeight - window.innerHeight
      const p = clamp((scrollY - top) / Math.max(1, h), 0, 1)

      const total = wordSpans.length
      wordSpans.forEach((w, i) => {
        const threshold = i / total
        if (p >= threshold) w.classList.add('lit')
        else w.classList.remove('lit')
      })
      if (p >= 0.92) attr.classList.add('visible')
      else attr.classList.remove('visible')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={sectionRef} className="off-quote-section" data-off-section="2">
      <div className="off-quote-sticky">
        <div className="off-quote-left">
          <div className="off-quote-left-title">Interests</div>
          <div className="off-quote-left-and">&amp;</div>
        </div>
        <div className="off-quote-right">
          <div ref={wordsRef} className="off-quote-words">
            {words.map((w, i) => (
              <span key={i} className="off-word">{w}&nbsp;</span>
            ))}
          </div>
          <div ref={attrRef} className="off-quote-attr">— Jais Singh · 2025</div>
        </div>
      </div>
    </div>
  )
}
