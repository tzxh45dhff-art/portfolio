import type { ReactNode } from 'react'

import useReducedMotion from '../../lib/useReducedMotion'

interface Props {
  children: ReactNode
  /** Seconds for one full pass. Larger is slower. */
  duration?: number
  reverse?: boolean
  className?: string
}

/**
 * Seamless infinite marquee.
 *
 * The track holds the children twice and translates by exactly -50%, so the
 * second copy lands where the first began and the loop has no visible seam.
 * Transform only; pauses on hover, and renders as a static row under reduced
 * motion rather than scrolling content the visitor cannot stop.
 */
export default function Marquee({ children, duration = 32, reverse = false, className }: Props) {
  const reduced = useReducedMotion()

  return (
    <div className={`marquee${className ? ` ${className}` : ''}`} data-static={reduced}>
      <div
        className="marquee__track"
        style={
          reduced
            ? undefined
            : { animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }
        }
      >
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
