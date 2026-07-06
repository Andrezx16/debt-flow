'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface CelebrationOverlayProps {
  show: boolean
  debtorName: string
}

export function CelebrationOverlay({ show, debtorName }: CelebrationOverlayProps) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!show || firedRef.current) return
    firedRef.current = true

    const end = Date.now() + 1800

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366F1', '#8B5CF6', '#A78BFA', '#C4B5FD'],
        gravity: 1.2,
        scalar: 0.9,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366F1', '#8B5CF6', '#A78BFA', '#C4B5FD'],
        gravity: 1.2,
        scalar: 0.9,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1.5rem',
            background: 'var(--status-success-bg)',
            borderRadius: '1.5rem',
            border: '1px solid var(--status-success)',
            textAlign: 'center',
          }}
        >
          <div style={{ color: 'var(--status-success)', marginBottom: '0.25rem' }}>
            <CheckCircle size={40} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--status-success)', letterSpacing: '-0.03em' }}>
            ¡Deuda completada!
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {debtorName} ha pagado el 100% de su deuda.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
