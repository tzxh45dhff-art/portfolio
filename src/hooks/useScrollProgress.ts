import { useScroll, useSpring } from 'framer-motion'
import type { MotionValue, UseScrollOptions } from 'framer-motion'
import type { RefObject } from 'react'

export interface ScrollProgressOptions {
  /**
   * Where the element's travel starts and ends, framer-motion offset syntax.
   * Defaults to `['start end', 'end start']` — 0 the moment the element's top
   * touches the bottom of the viewport, 1 once its bottom leaves the top.
   */
  offset?: UseScrollOptions['offset']
  /** Scroll axis. Defaults to the vertical axis. */
  axis?: 'x' | 'y'
  /**
   * Smooth the raw progress with a spring. `true` uses a calm default,
   * or pass a number to set the damping. Off by default — raw progress is
   * already frame-perfect and cheaper.
   */
  smooth?: boolean | number
}

const DEFAULT_OFFSET: UseScrollOptions['offset'] = ['start end', 'end start']

/**
 * A 0..1 `MotionValue` describing how far `target` has travelled through the
 * viewport. Replaces hand-rolled window scroll listeners: framer-motion reads
 * scroll off a single passive listener and writes on the animation frame.
 *
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const progress = useScrollProgress(ref)
 * const y = useTransform(progress, [0, 1], ['0%', '-12%'])
 * return <div ref={ref}><motion.img style={{ y }} /></div>
 * ```
 *
 * Only ever drive `transform` and `opacity` from the returned value.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = {},
): MotionValue<number> {
  const { offset = DEFAULT_OFFSET, axis = 'y', smooth = false } = options

  const { scrollXProgress, scrollYProgress } = useScroll({ target, offset, axis })
  const raw = axis === 'x' ? scrollXProgress : scrollYProgress

  const smoothed = useSpring(raw, {
    stiffness: 220,
    damping: typeof smooth === 'number' ? smooth : 40,
    mass: 0.35,
    restDelta: 0.0005,
  })

  return smooth === false ? raw : smoothed
}

/** A 0..1 `MotionValue` for the whole document — useful for progress bars. */
export function usePageScrollProgress(smooth = false): MotionValue<number> {
  const { scrollYProgress } = useScroll()
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    mass: 0.35,
    restDelta: 0.0005,
  })
  return smooth ? smoothed : scrollYProgress
}

export default useScrollProgress
