import { useEffect, useRef } from 'react'

const CARDS = [
  { code: 'IG', label: 'Instagram', handle: '@jais_132',          href: 'https://www.instagram.com/jais_132/',                  img: '/assets/social-ig.jpg' },
  { code: 'GH', label: 'GitHub',    handle: '@tzxh45dhff-art',    href: 'https://github.com/tzxh45dhff-art',                    img: 'https://github.com/tzxh45dhff-art.png' },
  { code: 'LI', label: 'LinkedIn',  handle: 'Jaisgurnoor Singh',  href: 'https://linkedin.com/in/jaisgurnoor-singh-1477ba391',  img: '/assets/social-li.jpg' },
  { code: 'TW', label: 'Twitter',   handle: '@JaisgurnoorS',      href: 'https://x.com/JaisgurnoorS',                            img: '/assets/social-tw.jpg' },
]

export default function OfflineSocials() {
  const rootRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const links = linksRef.current
    if (!root || !links) return

    const headerIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in-view')
        })
      },
      { threshold: 0.18, rootMargin: '-80px' }
    )
    root.querySelectorAll('.off-section-header, .off-section-hr, .off-social-card').forEach((el) =>
      headerIO.observe(el)
    )

    const linkIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) links.classList.add('visible')
        })
      },
      { threshold: 0.5 }
    )
    linkIO.observe(links)

    const cleanups: Array<() => void> = []
    const isTouch = window.matchMedia('(max-width: 900px)').matches || 'ontouchstart' in window

    if (!isTouch) {
      root.querySelectorAll<HTMLElement>('.off-social-card').forEach((card) => {
        let vx = 0,
          vy = 0,
          tx = 0,
          ty = 0,
          raf = 0

        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          // Heavier, more restrained magnetism (0.18 → 0.06)
          tx = (e.clientX - (rect.left + rect.width / 2)) * 0.06
          ty = (e.clientY - (rect.top + rect.height / 2)) * 0.06
        }
        const onLeave = () => {
          tx = 0
          ty = 0
        }
        const spring = () => {
          // Slower spring constant — feels weighted
          vx += (tx - vx) * 0.07
          vy += (ty - vy) * 0.07
          card.style.transform = `translate3d(${vx.toFixed(2)}px,${vy.toFixed(2)}px,0)`
          raf = requestAnimationFrame(spring)
        }
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        spring()
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove)
          card.removeEventListener('mouseleave', onLeave)
          cancelAnimationFrame(raf)
        })
      })
    }

    return () => {
      headerIO.disconnect()
      linkIO.disconnect()
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <div ref={rootRef} className="off-socials-section" data-off-section="4">
      <div className="off-section-header">
        <span className="off-section-header-eyebrow">V — Outwards</span>
        <span className="off-section-header-title">Where to find the rest</span>
        <span className="off-section-header-sub">Quiet channels. Long-form attention.</span>
      </div>
      <div className="off-section-hr" />

      <div className="off-socials-grid">
        {CARDS.map((c, i) => (
          <a
            key={c.code}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="off-social-card"
          >
            <div className="off-social-card-frame">
              <img src={c.img} alt={c.label} className="off-social-card-img" />
              <div className="off-social-card-shade" />
              <div className="off-social-card-meta">
                <span className="off-social-card-num">0{i + 1}</span>
                <span className="off-social-card-label">{c.label}</span>
              </div>
              <div className="off-social-card-hover">
                <span className="off-social-card-handle">{c.handle}</span>
                <span className="off-social-card-arrow">↗</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div ref={linksRef} className="off-social-links">
        <a href="https://github.com/tzxh45dhff-art" target="_blank" rel="noopener noreferrer" className="off-social-link">GitHub</a>
        <a href="https://linkedin.com/in/jaisgurnoor-singh-1477ba391" target="_blank" rel="noopener noreferrer" className="off-social-link">LinkedIn</a>
        <a href="https://x.com/JaisgurnoorS" target="_blank" rel="noopener noreferrer" className="off-social-link">Twitter</a>
        <a href="mailto:jaissingh783@gmail.com" className="off-social-link">Email</a>
      </div>
    </div>
  )
}
