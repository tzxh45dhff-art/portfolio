import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * `true` when the visitor has asked the OS to reduce motion.
 *
 * Reads `false` on the first render (SSR-safe) and syncs on mount, so nothing
 * animates against a stale value if the preference changes mid-session.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(QUERY)
    const sync = () => setReduced(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [])

  return reduced
}

export default useReducedMotion
