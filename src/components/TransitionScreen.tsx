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
              className="initials-container"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.3, delayChildren: 0.5 }
                }
              }}
            >
              <motion.span 
                className="initial-letter"
                variants={{
                  hidden: { opacity: 0, y: 50, rotateX: -90 },
                  visible: { opacity: 1, y: 0, rotateX: 0 }
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                J
              </motion.span>
              <motion.span 
                className="initial-letter"
                variants={{
                  hidden: { opacity: 0, y: 50, rotateX: -90 },
                  visible: { opacity: 1, y: 0, rotateX: 0 }
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                G
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
