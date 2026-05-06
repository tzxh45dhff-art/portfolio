import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import '../styles/preloader.css'

export default function TransitionScreen() {
  const { isTransitioning, completeTransition } = useTransition()

  // Reset state when a transition starts
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        completeTransition()
      }, 2000) // Wait 2s for JG animation, then automatically complete
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, completeTransition])

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="neon-preloader"
          initial={{ opacity: 0, scale: 1.2, borderRadius: '0%' }}
          animate={{ opacity: 1, scale: 1, borderRadius: '0%' }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            borderRadius: '50%',
            filter: 'blur(10px)',
          }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="neon-preloader-content">
            <motion.div
              className="preloader-initials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              JG
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
