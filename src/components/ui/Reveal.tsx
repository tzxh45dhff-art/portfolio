import { motion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

import { DUR, EASE_OUT, VIEWPORT } from '../../lib/motion'
import useReducedMotion from '../../lib/useReducedMotion'

interface Props {
  children: ReactNode
  className?: string
  as?: ElementType
  delay?: number
  /** Travel distance in px. */
  y?: number
  /** Fraction of the element that must be visible before it fires. */
  amount?: number
}

/**
 * Generic scroll-reveal wrapper: fade + rise, once, transform/opacity only.
 * Collapses to a plain fade when the visitor prefers reduced motion.
 */
export default function Reveal({
  children,
  className,
  as = 'div',
  delay = 0,
  y = 26,
  amount = VIEWPORT.amount,
}: Props) {
  const reduced = useReducedMotion()
  const Tag = motion(as as ElementType)

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: VIEWPORT.margin }}
      transition={{ duration: reduced ? 0.25 : DUR.base, ease: EASE_OUT, delay: reduced ? 0 : delay }}
    >
      {children}
    </Tag>
  )
}
