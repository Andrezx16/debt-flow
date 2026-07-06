'use client'

import { useEffect, useRef, useState } from 'react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export type FormatType = 'currency' | 'percentage' | 'number'

interface NumberTickerProps {
  value: number
  duration?: number
  formatType?: FormatType
  className?: string
  style?: React.CSSProperties
}

export function NumberTicker({
  value,
  duration = 800,
  formatType = 'number',
  className,
  style,
}: NumberTickerProps) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const start = prevRef.current
    const end = value
    const startTime = performance.now()

    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + (end - start) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        prevRef.current = end
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, duration])

  const getFormattedValue = (val: number) => {
    if (formatType === 'currency') return formatCurrency(val)
    if (formatType === 'percentage') return formatPercentage(val)
    return String(Math.round(val))
  }

  return (
    <span className={className} style={style}>
      {getFormattedValue(display)}
    </span>
  )
}
