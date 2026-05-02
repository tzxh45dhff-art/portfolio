import { personal } from '../data'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Online', href: '/online' },
  { label: 'Offline', href: '/offline' },
]

const socials = [
  { label: 'GitHub', href: personal.socials.github },
  { label: 'LinkedIn', href: personal.socials.linkedin },
  { label: 'Email', href: `mailto:${personal.email}` },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* Top CTA */}
      <div className="footer-cta">
        <span className="footer-cta-label">GOT A PROJECT IN MIND?</span>
        <a
          href={`mailto:${personal.email}`}
          className="footer-cta-email"
        >
          {personal.email}
        </a>
        <div className="footer-cta-tagline">
          Currently available for internships &amp; freelance work.
        </div>
      </div>

      {/* Divider */}
      <div className="footer-rule" />

      {/* Mid grid */}
      <div className="footer-mid">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-monogram">JS</div>
          <div className="footer-name">{personal.name}</div>
          <div className="footer-title">{personal.subtitle}</div>
          <div className="footer-uni">{personal.degree} · {personal.university}</div>
        </div>

        {/* Nav */}
        <div className="footer-col">
          <span className="footer-col-label">Navigate</span>
          <nav className="footer-nav">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="footer-nav-link">{l.label}</a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <span className="footer-col-label">Connect</span>
          <div className="footer-nav">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                className="footer-nav-link"
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="footer-col">
          <span className="footer-col-label">Status</span>
          <div className="footer-status-dot">
            <span className="footer-dot" />
            <span className="footer-status-text">Available for work</span>
          </div>
          <div className="footer-location">{personal.location}</div>
          <a href={personal.resumeUrl} className="footer-resume-btn" download>
            Download CV
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-rule" />
      <div className="footer-bottom">
        <span className="footer-copy">© {year} {personal.name}. All rights reserved.</span>
        <span className="footer-built">Built with React + Framer Motion</span>
      </div>
    </footer>
  )
}
