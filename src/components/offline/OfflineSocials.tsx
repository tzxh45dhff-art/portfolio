import { useEffect, useRef } from 'react'

const CARDS = [
  { code: 'IG', label: 'Instagram', href: 'https://instagram.com', img: '/assets/social-ig.jpg' },
  { code: 'GH', label: 'GitHub', href: 'https://github.com', img: '/assets/social-gh.jpg' },
  { code: 'LI', label: 'LinkedIn', href: 'https://linkedin.com', img: '/assets/social-li.jpg' },
  { code: 'TW', label: 'Twitter', href: 'https://twitter.com', img: '/assets/social-tw.jpg' },
  { code: 'YT', label: 'YouTube', href: 'https://youtube.com', img: '/assets/social-yt.jpg' },
  { code: 'BE', label: 'Behance', href: 'https://behance.net', img: '/assets/social-be.jpg' },
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
      { threshold: 0.15, rootMargin: '-60px' }
    )
    root.querySelectorAll('.off-section-header, .off-section-hr').forEach((el) => headerIO.observe(el))

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
          tx = (e.clientX - (rect.left + rect.width / 2)) * 0.18
          ty = (e.clientY - (rect.top + rect.height / 2)) * 0.18
        }
        const onLeave = () => {
          tx = 0
          ty = 0
        }
        const spring = () => {
          vx += (tx - vx) * 0.15
          vy += (ty - vy) * 0.15
          card.style.transform = `translate(${vx}px,${vy}px) scale(${Math.abs(vx) + Math.abs(vy) > 1 ? 1.03 : 1})`
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
        <span className="off-section-header-left">What&apos;s up</span>
        <span className="off-section-header-right">On Socials</span>
      </div>
      <div className="off-section-hr" />

      <div className="off-socials-grid">
        {CARDS.map((c) => (
          <a key={c.code} href={c.href} target="_blank" rel="noopener noreferrer" className="off-social-card">
            <div className="off-social-card-inner">
              <img src={c.img} alt={c.label} className="off-social-card-img" />
              <div className="off-social-caption">
                <span>{c.label}</span>
                <span>↗</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div ref={linksRef} className="off-social-links">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="off-social-link">GitHub ↗</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="off-social-link">LinkedIn ↗</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="off-social-link">Twitter ↗</a>
      </div>
    </div>
  )
}
