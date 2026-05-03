import { useEffect, useRef, useState } from 'react'

const TAGLINE = 'welcome to the world outside the screens'
const BADGES = [
  { label: 'MUSIC', emoji: '🎧', section: 0 },
  { label: 'CHESS', emoji: '♟', section: 1 },
  { label: 'BOOKS', emoji: '📖', section: 2 },
  { label: 'DESIGN', emoji: '✦', section: 3 },
  { label: 'FINANCE', emoji: '₿', section: 4 },
  { label: 'FILM', emoji: '🎬', section: 5 },
]

function splitChars(text: string) {
  return text.split('').map((ch, i) =>
    ch === ' ' ? (
      <span key={i} className="off-char-space">&nbsp;</span>
    ) : (
      <span key={i} className="off-char">{ch}</span>
    )
  )
}

export default function OfflineHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)
  const welcomeRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef({ p2: false, p3: false })
  const [activeBadge, setActiveBadge] = useState<number | null>(null)

  const scrollToInterest = (sectionIndex: number) => {
    const interestBlocks = document.querySelectorAll('.off-interest-block')
    // MUSIC=0, CHESS=1, BOOKS=2, DESIGN+FILM=3
    const targetIdx = sectionIndex >= 4 ? 3 : sectionIndex
    const target = interestBlocks[targetIdx]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setActiveBadge(sectionIndex)
      setTimeout(() => setActiveBadge(null), 2000)
    }
  }

  useEffect(() => {
    const wrapper = wrapperRef.current
    const title = titleRef.current
    const sub = subRef.current
    const badgesEl = badgesRef.current
    const welcome = welcomeRef.current
    if (!wrapper || !title || !sub || !badgesEl || !welcome) return

    const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
    const norm = (v: number, lo: number, hi: number) => clamp((v - lo) / (hi - lo), 0, 1)

    const revealAll = () => {
      title.style.transform = 'scale(1)'
      title.style.filter = 'blur(0)'
      title.style.opacity = '1'
      title.style.letterSpacing = '-0.05em'
      sub.style.opacity = '1'
      badgesEl.style.opacity = '1'
      welcome.style.opacity = '1'
      welcome.style.transform = 'translateY(0)'
      wrapper.querySelectorAll('.off-char').forEach((ch, i) => {
        setTimeout(() => ch.classList.add('visible'), i * 20)
      })
      badgesEl.querySelectorAll<HTMLElement>('.off-badge').forEach((b, i) => {
        setTimeout(() => {
          b.style.opacity = '1'
          b.style.transform = 'translateY(0)'
          b.style.transition = 'opacity 0.5s, transform 0.5s, border-color 0.3s, color 0.3s, box-shadow 0.3s, background 0.3s'
        }, i * 80 + 200)
      })
    }

    const onScroll = () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        revealAll()
        return
      }
      const scrollY = window.scrollY
      const top = wrapper.offsetTop
      const h = wrapper.offsetHeight - window.innerHeight
      const p = clamp((scrollY - top) / Math.max(1, h), 0, 1)

      const p1 = easeOut(norm(p, 0, 0.3))
      title.style.transform = `scale(${lerp(1.6, 1, p1)})`
      title.style.filter = `blur(${lerp(20, 0, p1)}px)`
      title.style.opacity = String(p1)
      title.style.letterSpacing = lerp(0.3, -0.05, p1) + 'em'

      const p2 = norm(p, 0.25, 0.55)
      sub.style.opacity = String(easeOut(p2))
      welcome.style.opacity = String(easeOut(p2))
      welcome.style.transform = `translateY(${lerp(20, 0, easeOut(p2))}px)`
      if (p2 > 0 && !phaseRef.current.p2) {
        phaseRef.current.p2 = true
        wrapper.querySelectorAll('.off-char').forEach((ch, i) => {
          setTimeout(() => ch.classList.add('visible'), i * 20)
        })
      }

      const p3 = norm(p, 0.55, 1.0)
      if (p3 > 0 && !phaseRef.current.p3) {
        phaseRef.current.p3 = true
        badgesEl.querySelectorAll<HTMLElement>('.off-badge').forEach((b, i) => {
          setTimeout(() => {
            b.style.opacity = '1'
            b.style.transform = 'translateY(0)'
            b.style.transition =
              'opacity 0.5s var(--ease-expo), transform 0.5s var(--ease-expo), border-color 0.3s, color 0.3s, box-shadow 0.3s, background 0.3s'
          }, i * 80 + 50)
        })
      }
      if (p3 > 0) badgesEl.style.opacity = String(Math.min(p3 * 3, 1))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} className="off-hero-pin" data-off-section="0">
      <div className="off-hero-sticky">
        <div className="off-hero-content">
          <div ref={titleRef} className="off-hero-title">OFFLINE</div>
          
          <div ref={subRef} className="off-hero-sub">
            <div className="off-hero-name">{splitChars('Jais Singh')}</div>
            <div className="off-hero-role">{splitChars('Year 1 · CSE AI')}</div>
          </div>

          <div ref={welcomeRef} className="off-hero-welcome">
            <div className="off-welcome-line">{splitChars(TAGLINE)}</div>
            <div className="off-welcome-accent">
              <span className="off-neon-text">touch grass. feel alive.</span>
            </div>
          </div>

          <div ref={badgesRef} className="off-hero-badges">
            {BADGES.map((b, i) => (
              <button
                key={b.label}
                className={`off-badge${activeBadge === i ? ' off-badge-active' : ''}`}
                onClick={() => scrollToInterest(i)}
                type="button"
              >
                <span className="off-badge-emoji">{b.emoji}</span>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
