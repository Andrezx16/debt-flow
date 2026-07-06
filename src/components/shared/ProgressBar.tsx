'use client'

import { useEffect, useRef } from 'react'
import { clamp } from '@/lib/utils'

interface ProgressBarProps {
  percentage: number
  height?: number
  animated?: boolean
  color?: string
  className?: string
}

export function ProgressBar({
  percentage,
  height = 8,
  animated = true,
  color,
  className,
}: ProgressBarProps) {
  const pct = clamp(percentage, 0, 100)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animated || !barRef.current) return
    // Let CSS transition handle animation
    barRef.current.style.width = `${pct}%`
  }, [pct, animated])

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height,
        borderRadius: 999,
        background: 'var(--border)',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08)',
      }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          width: animated ? '0%' : `${pct}%`,
          borderRadius: 999,
          background: color ?? `linear-gradient(90deg, var(--accent), var(--accent-hover))`,
          transition: animated ? 'width 1.2s cubic-bezier(0.4,0,0.2,1)' : 'none',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      />
    </div>
  )
}
