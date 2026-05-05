import { useEffect, useRef } from 'react'

const BADGES = ['LOCAL LLMS', 'VECTOR DB', 'CLOUD ARCHITECTURE', 'AGENTS']

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
          <div className="on-hero-status-dot" style={{ animation: 'none', opacity: 0.8 }} />
          Currently building intelligent systems
        </div>

        <div ref={titleRef} className="on-hero-title">
          ONLINE<span className="on-hero-cursor" style={{ animation: 'none', opacity: 0.5 }}>.</span>
        </div>

        <div className="on-hero-sub">
          <div className="on-hero-left">
            <div className="on-hero-line-1">PORTFOLIO</div>
            <div className="on-hero-line-2">Full Stack Developer · AI Systems</div>
            <div className="on-hero-line-3">Crafting premium digital experiences</div>
          </div>
          <div className="on-hero-bio">
            Obsessed with performance, clean architecture, and building products that bridge complex systems with beautiful, intuitive interfaces. 
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
