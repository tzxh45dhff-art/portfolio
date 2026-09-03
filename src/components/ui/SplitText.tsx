import { motion } from 'framer-motion'
import type { ElementType } from 'react'

import { DUR, EASE_OUT, STAGGER, VIEWPORT } from '../../lib/motion'
import useReducedMotion from '../../lib/useReducedMotion'

interface Props {
  text: string
  className?: string
  as?: ElementType
  stagger?: number
  delay?: number
}

/**
 * Splits a string into words and characters, each rising out of its own
 * overflow-hidden mask on a stagger.
 *
 * Accessibility: the wrapper carries the full string as an `aria-label` and the
 * split spans are hidden from the accessibility tree, so screen readers get one
 * clean phrase instead of a stream of single letters. Words are kept intact so
 * the line breaks naturally.
 */
export default function SplitText({
  text,
  className,
  as = 'span',
  stagger = STAGGER.tight,
  delay = 0,
}: Props) {
  const reduced = useReducedMotion()
  const Tag = motion(as as ElementType)
  const words = text.split(' ')

  if (reduced) {
    return (
      <Tag
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: VIEWPORT.amount }}
        transition={{ duration: 0.25 }}
      >
        {text}
      </Tag>
    )
  }

  let index = 0

  return (
    <Tag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: VIEWPORT.amount, margin: VIEWPORT.margin }}
    >
      {words.map((word, w) => (
        <span className="split-word" aria-hidden="true" key={`${word}-${w}`}>
          {[...word].map((char, c) => {
            const i = index++
            return (
              <span className="split-mask" key={`${char}-${c}`}>
                <motion.span
                  className="split-char"
                  variants={{
                    hidden: { y: '105%' },
                    show: {
                      y: '0%',
                      transition: { duration: DUR.base, ease: EASE_OUT, delay: delay + i * stagger },
                    },
                  }}
                >
                  {char}
                </motion.span>
              </span>
            )
          })}
          {w < words.length - 1 ? <span className="split-space">&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  )
}
