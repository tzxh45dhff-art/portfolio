import { motion } from 'framer-motion'

import Reveal from './ui/Reveal'
import SplitText from './ui/SplitText'
import { personal, stats, skills } from '../data'
import { DUR, EASE_OUT, STAGGER, VIEWPORT } from '../lib/motion'
import useReducedMotion from '../lib/useReducedMotion'

/** Phrases lifted out of the mission statement and given a lime underline. */
const HIGHLIGHTS = ['complexity into clarity', 'artificial intelligence']

/**
 * Splits the mission statement around the highlighted phrases so each can be
 * wrapped without hard-coding the copy — the source of truth stays data.ts.
 */
function segment(sentence: string) {
  const pattern = new RegExp(`(${HIGHLIGHTS.join('|')})`, 'gi')
  return sentence.split(pattern).filter(Boolean)
}

export default function AboutText() {
  const reduced = useReducedMotion()
  const parts = segment(personal.missionStatement)

  return (
    <section className="about on-dark" data-nav-theme="dark">
      <div className="shell about__inner">
        <Reveal className="about__head" y={18}>
          <span className="eyebrow">01 — Position</span>
          <span className="about__head-rule rule-dark" />
        </Reveal>

        <div className="about__body">
          <p className="about__statement">
            {parts.map((part, i) =>
              HIGHLIGHTS.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
                <span className="about__mark" key={i}>
                  {part}
                </span>
              ) : (
                <SplitText key={i} text={part} className="about__seg" stagger={0.012} />
              ),
            )}
          </p>

          <aside className="about__spec">
            <Reveal className="about__stats" y={14}>
              {stats.map((stat) => (
                <div className="about__stat" key={stat.label}>
                  <span
                    className="about__stat-value"
                    data-word={'highlight' in stat && stat.highlight === true}
                  >
                    {stat.value}
                  </span>
                  <span className="about__stat-key">{stat.label}</span>
                </div>
              ))}
            </Reveal>

            <div className="about__skills">
              <span className="eyebrow about__skills-title">Capability</span>
              {skills.map((skill, i) => (
                <div className="about__skill" key={skill.name}>
                  <span className="about__skill-row">
                    <span className="about__skill-name">{skill.name}</span>
                    <span className="about__skill-value">{skill.level}</span>
                  </span>
                  {/* scaleX, never width — this stays on the compositor. */}
                  <span className="about__skill-track">
                    <motion.span
                      className="about__skill-fill"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: skill.level / 100 }}
                      viewport={{ once: true, amount: 0.6, margin: VIEWPORT.margin }}
                      transition={{
                        duration: reduced ? 0 : DUR.slow,
                        ease: EASE_OUT,
                        delay: reduced ? 0 : i * STAGGER.base,
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
