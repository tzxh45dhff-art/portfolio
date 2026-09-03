import { useState } from 'react'

import Reveal from './ui/Reveal'
import TransitionLink from './TransitionLink'

const DOORS = [
  {
    id: 'online',
    index: '01',
    to: '/online',
    title: 'Online',
    sub: 'The built things',
    note: 'Projects, deployments, certifications',
    img: '/media/online.jpg',
    w: 1600,
    h: 1066,
  },
  {
    id: 'offline',
    index: '02',
    to: '/offline',
    title: 'Offline',
    sub: 'Everything else',
    note: 'Court, camera, the time away from a screen',
    img: '/media/offline.jpg',
    w: 900,
    h: 1600,
  },
] as const

/**
 * The two-door hub.
 *
 * The panels keep a fixed 1fr/1fr split. An earlier version animated
 * `grid-template-columns` to 1.34fr/0.66fr on hover, which reshaped both
 * `object-fit: cover` frames mid-transition — the crop window moved with the
 * frame and threw most of each photograph out of view. The hover now lives
 * entirely in a contained image scale, so the frame geometry never changes.
 */
export default function OnOffLine() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section className="hub on-dark" data-nav-theme="dark">
      <div className="shell">
        <Reveal className="hub__head" y={18}>
          <span className="eyebrow">03 — Two doors</span>
          <h2 className="hub__head-title">Pick a side</h2>
          <span className="hub__head-rule rule-dark" />
          <span className="hub__head-sub mono">Both lead somewhere real</span>
        </Reveal>
      </div>

      <div className="hub__grid">
        {DOORS.map((door, i) => (
          <Reveal
            className="hub__panel"
            key={door.id}
            delay={i * 0.08}
            y={24}
            amount={0.2}
          >
            <div
              className="hub__panel-inner"
              data-state={active === null ? 'idle' : active === door.id ? 'active' : 'dimmed'}
              onPointerEnter={() => setActive(door.id)}
              onPointerLeave={() => setActive(null)}
              onFocusCapture={() => setActive(door.id)}
              onBlurCapture={() => setActive(null)}
            >
              <div className="hub__media">
                <img
                  className="hub__img"
                  src={door.img}
                  alt=""
                  width={door.w}
                  height={door.h}
                  loading="lazy"
                  decoding="async"
                />
                <span className="hub__scrim" aria-hidden="true" />
              </div>

              <div className="hub__content">
                <span className="hub__index mono">{door.index}</span>

                <h3 className="hub__title">{door.title}</h3>

                <span className="hub__wipe" aria-hidden="true" />

                <div className="hub__meta">
                  <span className="hub__sub">{door.sub}</span>
                  <span className="hub__note mono">{door.note}</span>
                </div>
              </div>

              {/* The whole panel is the target; the anchor covers it so the
                  accessible name and keyboard focus land in one place. */}
              <TransitionLink
                to={door.to}
                className="hub__link"
                aria-label={`${door.title} — ${door.sub}`}
              >
                <span className="sr-only">{`${door.title} — ${door.sub}`}</span>
              </TransitionLink>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
