import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import useReducedMotion from '../lib/useReducedMotion'
import { DUR, EASE_INOUT, EASE_OUT } from '../lib/motion'
import { personal } from '../data'

const SESSION_KEY = 'jais:intro-played'
/** Never flash: even a warm cache holds the panel this long. */
const MIN_VISIBLE_MS = 900
/** The assets worth waiting on — the hero is the first thing revealed. */
const CRITICAL_IMAGES = ['/media/portrait.png']

function hasPlayed() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    /* Private mode / storage disabled — just play it. */
    return false
  }
}

function markPlayed() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* Non-fatal. */
  }
}

export default function Preloader() {
  const reduced = useReducedMotion()
  /* Decided once, synchronously, so the panel never paints on a repeat view. */
  const [active, setActive] = useState(() => !hasPlayed())
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!active) return

    document.body.classList.add('is-loading')
    const startedAt = performance.now()
    let cancelled = false
    /* Real load progress, eased toward by the rAF loop below. */
    let target = 0.08

    const bump = (amount: number) => {
      target = Math.min(1, target + amount)
    }

    const waitFor = <T,>(promise: Promise<T>, amount: number) =>
      promise.then(
        () => bump(amount),
        () => bump(amount), // a failed asset must not strand the panel
      )

    const jobs: Promise<unknown>[] = [waitFor(document.fonts.ready, 0.34)]

    for (const src of CRITICAL_IMAGES) {
      const img = new Image()
      img.src = src
      jobs.push(waitFor(img.decode(), 0.5 / CRITICAL_IMAGES.length))
    }

    let settled = false
    void Promise.all(jobs).then(() => {
      settled = true
      target = 1
    })

    /* Ease the displayed number toward `target` so it never jumps. */
    let shown = 0
    const tick = () => {
      if (cancelled) return

      shown += (target - shown) * 0.08
      const elapsed = performance.now() - startedAt
      const held = elapsed >= MIN_VISIBLE_MS

      if (settled && held && target - shown < 0.01) {
        setProgress(1)
        markPlayed()
        setActive(false)
        return
      }

      setProgress(shown)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      document.body.classList.remove('is-loading')
    }
  }, [active])

  const pct = Math.round(progress * 100)

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="preloader"
          className="preloader on-dark"
          initial={{ opacity: 1 }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }
              : {
                  /* Hard directional curtain, not a fade — the hero is already
                     in place underneath and gets uncovered. */
                  clipPath: 'inset(0 0 100% 0)',
                  transition: { duration: DUR.curtain, ease: EASE_INOUT },
                }
          }
          style={{ clipPath: 'inset(0 0 0% 0)' }}
          aria-hidden="true"
        >
          <div className="preloader__mark">{personal.monogram}</div>

          <div className="preloader__foot">
            <span className="preloader__label">{personal.buildingSince}</span>
            <span className="preloader__count">{String(pct).padStart(3, '0')}</span>
          </div>

          <div className="preloader__rail">
            <motion.span
              className="preloader__fill"
              style={{ scaleX: progress }}
              transition={{ duration: 0 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
