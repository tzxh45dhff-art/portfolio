import Reveal from './ui/Reveal'
import Marquee from './ui/Marquee'
import TransitionLink from './TransitionLink'
import { personal, marqueeItems } from '../data'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="foot on-dark" data-nav-theme="dark">
      <div className="shell foot__inner">
        <Reveal className="foot__lead" y={22}>
          <span className="eyebrow">04 — Open line</span>
          <h2 className="foot__title">
            Let&rsquo;s build
            <span className="foot__title-dim">something worth shipping.</span>
          </h2>
        </Reveal>

        <Reveal className="foot__mail" delay={0.06} y={18}>
          <a className="foot__mail-link lime-underline" href={`mailto:${personal.email}`}>
            {personal.email}
          </a>
        </Reveal>

        <div className="foot__cols">
          <Reveal className="foot__col" y={14}>
            <span className="eyebrow">Elsewhere</span>
            <ul className="foot__links">
              <li>
                <a
                  className="foot__link lime-underline"
                  href={personal.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="foot__link lime-underline"
                  href={personal.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a className="foot__link lime-underline" href={personal.resumeUrl}>
                  Résumé
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal className="foot__col" delay={0.05} y={14}>
            <span className="eyebrow">Navigate</span>
            <ul className="foot__links">
              <li>
                <TransitionLink to="/online" className="foot__link lime-underline">
                  Online
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/offline" className="foot__link lime-underline">
                  Offline
                </TransitionLink>
              </li>
              <li>
                <TransitionLink to="/contact" className="foot__link lime-underline">
                  Contact
                </TransitionLink>
              </li>
            </ul>
          </Reveal>

          <Reveal className="foot__col foot__col--meta" delay={0.1} y={14}>
            <span className="eyebrow">On record</span>
            <dl className="foot__meta">
              <div>
                <dt>Based in</dt>
                <dd>{personal.location}</dd>
              </div>
              <div>
                <dt>Studying</dt>
                <dd>{personal.degree}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd className="foot__status">Open to internships</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>

      <Marquee className="foot__marquee" duration={38}>
        {marqueeItems.map((item) => (
          <span className="foot__marquee-item" key={item}>
            {item}
          </span>
        ))}
      </Marquee>

      <div className="shell foot__rail">
        <span className="mono">
          &copy; {YEAR} {personal.name}
        </span>
        <span className="mono">{personal.buildingSince}</span>
      </div>
    </footer>
  )
}
