import { useEffect, useRef } from 'react'

const QUOTE = "Start small. Ship daily. The hours you put in when no one's watching are the ones that define where you end up."

export default function OfflineQuote() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)
  const attrRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const words = QUOTE.split(' ')

  useEffect(() => {
    const section = sectionRef.current
    const wordsEl = wordsRef.current
    const attr = attrRef.current
    const rule = ruleRef.current
    if (!section || !wordsEl || !attr || !rule) return

    const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
    const wordSpans = wordsEl.querySelectorAll<HTMLElement>('.off-word')

    const onScroll = () => {
      const scrollY = window.scrollY
      const top = section.offsetTop
      const h = section.offsetHeight - window.innerHeight
      const p = clamp((scrollY - top) / Math.max(1, h), 0, 1)

      // Faster: words start revealing immediately, finish well before pin releases
      const start = 0.05
      const end = 0.65
      const reveal = clamp((p - start) / (end - start), 0, 1)
      const total = wordSpans.length
      wordSpans.forEach((w, i) => {
        const threshold = i / total
        // Soft per-word easing window so they fade rather than snap
        const localP = clamp((reveal - threshold) / (1 / total + 0.02), 0, 1)
        const e = easeOut(localP)
        w.style.color = `rgba(26, 20, 14, ${0.16 + e * 0.78})`
      })
      rule.style.transform = `scaleX(${easeOut(clamp((p - 0.02) / 0.25, 0, 1))})`
      attr.style.opacity = String(easeOut(clamp((p - 0.7) / 0.18, 0, 1)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={sectionRef} className="off-quote-section" data-off-section="2">
      <div className="off-quote-sticky">
        <div className="off-quote-eyebrow">
          <span>III</span>
          <span className="off-quote-eyebrow-rule" />
          <span>A note to self</span>
        </div>

        <div ref={ruleRef} className="off-quote-toprule" />

        <div className="off-quote-body">
          <div ref={wordsRef} className="off-quote-words">
            {words.map((w, i) => (
              <span key={i} className="off-word">{w}{i < words.length - 1 ? ' ' : ''}</span>
            ))}
          </div>
        </div>

        <div ref={attrRef} className="off-quote-attr">
          <span className="off-quote-attr-line" />
          <span>Jais Singh — Punjab, 2025</span>
        </div>
      </div>
    </div>
  )
}
