import { useEffect, useRef } from 'react'

const NAME = 'Jais Singh'
const ROLE = 'Year 1 · CSE AI'
const TAGLINE = 'building with intent'
const BADGES = ['MUSIC', 'CHESS', 'BOOKS', 'DESIGN', 'FINANCE', 'FILM']

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
  const bioRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef({ p2: false, p3: false })

  useEffect(() => {
    const wrapper = wrapperRef.current
    const title = titleRef.current
    const sub = subRef.current
    const badgesEl = badgesRef.current
    const bio = bioRef.current
    if (!wrapper || !title || !sub || !badgesEl || !bio) return

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
      wrapper.querySelectorAll('.off-char').forEach((ch, i) => {
        setTimeout(() => ch.classList.add('visible'), i * 20)
      })
      badgesEl.querySelectorAll<HTMLElement>('.off-badge').forEach((b, i) => {
        setTimeout(() => {
          b.style.opacity = '1'
          b.style.transform = 'translateY(0)'
          b.style.transition = 'opacity 0.5s, transform 0.5s, border-color 0.3s, color 0.3s'
        }, i * 60 + 200)
      })
      bio.style.opacity = '1'
      bio.style.transform = 'translateY(0)'
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

      const p2 = norm(p, 0.3, 0.6)
      sub.style.opacity = String(easeOut(p2))
      if (p2 > 0 && !phaseRef.current.p2) {
        phaseRef.current.p2 = true
        wrapper.querySelectorAll('.off-char').forEach((ch, i) => {
          setTimeout(() => ch.classList.add('visible'), i * 20)
        })
      }

      const p3 = norm(p, 0.6, 1.0)
      if (p3 > 0 && !phaseRef.current.p3) {
        phaseRef.current.p3 = true
        badgesEl.querySelectorAll<HTMLElement>('.off-badge').forEach((b, i) => {
          setTimeout(() => {
            b.style.opacity = '1'
            b.style.transform = 'translateY(0)'
            b.style.transition =
              'opacity 0.5s var(--ease-expo), transform 0.5s var(--ease-expo), border-color 0.3s, color 0.3s, box-shadow 0.3s'
          }, i * 60 + 50)
        })
        setTimeout(() => {
          bio.style.opacity = '1'
          bio.style.transform = 'translateY(0)'
        }, 300)
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
            <div className="off-hero-name">{splitChars(NAME)}</div>
            <div className="off-hero-role">{splitChars(ROLE)}</div>
            <div className="off-hero-tagline">{splitChars(TAGLINE)}</div>
          </div>
          <div ref={badgesRef} className="off-hero-badges">
            {BADGES.map((b) => (
              <div key={b} className="off-badge">{b}</div>
            ))}
          </div>
          <div ref={bioRef} className="off-hero-bio">
            Beyond the terminal — music, books, chess, and the quiet hours that make the loud ones worth it.
          </div>
        </div>
      </div>
    </div>
  )
}
