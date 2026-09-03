import type { Transition, Variants } from 'framer-motion'

/* Easing + duration constants, mirroring the CSS custom properties in
   tokens.css so JS-driven and CSS-driven motion stay in lockstep. */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const

export const DUR = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  curtain: 1.2,
} as const

export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.09,
} as const

export const T_FAST: Transition = { duration: DUR.fast, ease: EASE_OUT }
export const T_BASE: Transition = { duration: DUR.base, ease: EASE_OUT }
export const T_SLOW: Transition = { duration: DUR.slow, ease: EASE_OUT }
export const T_CURTAIN: Transition = { duration: DUR.curtain, ease: EASE_INOUT }

/** Shared whileInView config so every section reveals at the same trigger point. */
export const VIEWPORT = { once: true, amount: 0.25, margin: '0px 0px -10% 0px' } as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: T_BASE },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: T_BASE },
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER.base, delayChildren: 0.05 } },
}

/** Text rising out of an overflow-hidden mask. */
export const maskUp: Variants = {
  hidden: { y: '105%' },
  show: { y: '0%', transition: { duration: DUR.base, ease: EASE_OUT } },
}

/** Page-level enter/exit, compatible with AnimatePresence mode="wait". */
export const pageFade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: T_BASE },
  exit: { opacity: 0, y: -16, transition: T_FAST },
}
