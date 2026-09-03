import { useEffect, useState } from 'react'
import TransitionLink from './TransitionLink'
import { personal } from '../data'

// Rendered OUTSIDE the scaled hero scene so it doesn't shrink with it.
// Adapts color when scrolled past the cream hero into the dark sections.
export default function HeroNav() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 2.4
      /* Guarded: this ran on every scroll tick and re-rendered the nav each
         time, even though the boolean only flips twice per page. */
      const next = window.scrollY > threshold
      setDark((prev) => (prev === next ? prev : next))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`hero-nav-light hero-nav-fixed ${dark ? 'is-dark' : ''}`}>
      <div className="nav-logo">
        <span className="nav-logo-top">{personal.firstName}</span>
        <span className="nav-logo-bot">{personal.lastName}</span>
      </div>

      <div className="nav-actions">
        <TransitionLink to="/contact" className="nav-cta nav-cta-neon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h9A1.5 1.5 0 0 1 14 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5v-7Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="m2.5 5 5.5 4 5.5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>CONTACT</span>
        </TransitionLink>
        <a href={personal.resumeUrl} download className="nav-cta nav-cta-neon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2v8m0 0 3-3m-3 3L5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>DOWNLOAD RESUME</span>
        </a>
        <button className="nav-menu-sq" aria-label="Menu">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <line x1="0" y1="2" x2="16" y2="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="0" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
