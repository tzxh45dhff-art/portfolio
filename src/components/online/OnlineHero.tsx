import { useEffect, useRef } from 'react'

const BADGES = ['LOCAL LLMS', 'VECTOR DB', 'CLOUD ARCHITECTURE', 'AGENTS']
const BOOT = [
  { line: 'KERNEL v4.21.0', tone: 'ok' },
  { line: 'ENV: PRODUCTION', tone: 'ok' },
  { line: 'MODELS: LOADED', tone: 'ok' },
  { line: 'VECTORS: INDEXED', tone: 'ok' },
  { line: 'SLEEP: DISABLED', tone: 'warn' },
] as const

export default function OnlineHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    // Trigger entrance animations
    const status = wrapper.querySelector('.on-hero-status')
    const title = titleRef.current
    const left = wrapper.querySelector('.on-hero-left')
    const bio = wrapper.querySelector('.on-hero-bio')

    requestAnimationFrame(() => {
      status?.classList.add('in')
      title?.classList.add('in')
      left?.classList.add('in')
      bio?.classList.add('in')
    })

    wrapper.querySelectorAll<HTMLElement>('.on-boot-line').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 500 + i * 120)
    })
    wrapper.querySelectorAll<HTMLElement>('.on-badge').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 1000 + i * 80)
    })

    // Title parallax during pin scroll
    const onScroll = () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        if (title) title.style.transform = 'translateY(0)'
        return
      }
      const scrollY = window.scrollY
      const top = wrapper.offsetTop
      const h = wrapper.offsetHeight - window.innerHeight
      const p = Math.max(0, Math.min(1, (scrollY - top) / Math.max(1, h)))
      if (title) title.style.transform = `translateY(${p * -60}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} className="on-hero-pin" data-on-section="0">
      <div className="on-hero-sticky">
        <div className="on-hero-status">
          <div className="on-hero-status-dot" />
          SYSTEM: ONLINE · STATUS: COMPILING
        </div>

        <div className="on-hero-boot">
          {BOOT.map((b) => (
            <div key={b.line} className={`on-boot-line ${b.tone}`}>{b.line}</div>
          ))}
        </div>

        <div ref={titleRef} className="on-hero-title">
          ONLINE<span className="on-hero-cursor">█</span>
          <div className="on-glitch-layer" aria-hidden="true">ONLINE</div>
        </div>

        <div className="on-hero-sub">
          <div className="on-hero-left">
            <div className="on-hero-line-1">ROOT ACCESS</div>
            <div className="on-hero-line-2">Full Stack Developer · AI Systems</div>
            <div className="on-hero-line-3">Shipping intelligent systems</div>
          </div>
          <div className="on-hero-bio">
            Architecting software that bridges low-level systems and real-world AI applications. Code, compute, and continuous deployment.
          </div>
        </div>

        <div className="on-hero-badges">
          {BADGES.map((b) => (
            <div key={b} className="on-badge">{b}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
