'use client'

import { useMemo } from 'react'
import type { Payment } from '@/types'

interface CalendarCardProps {
  payments: Payment[]
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function CalendarCard({ payments }: CalendarCardProps) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const paymentDays = useMemo(() => {
    const set = new Set<string>()
    payments.forEach((p) => {
      if (p.status === 'approved') set.add(p.payment_date)
    })
    return set
  }, [payments])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  return (
    <div className="clay-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        {MONTHS[month]} {year} — Pagos del mes
      </h3>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
        {DAYS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-disabled)', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasPayment = paymentDays.has(dateStr)
          const isToday = day === today.getDate()

          return (
            <div
              key={day}
              title={hasPayment ? `Pago el ${dateStr}` : undefined}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: hasPayment || isToday ? 700 : 400,
                background: hasPayment
                  ? 'var(--accent)'
                  : isToday
                  ? 'var(--accent-muted)'
                  : 'transparent',
                color: hasPayment
                  ? 'var(--accent-text)'
                  : isToday
                  ? 'var(--accent)'
                  : 'var(--text-primary)',
                cursor: hasPayment ? 'default' : 'default',
                transition: 'background 0.15s ease',
              }}
            >
              {day}
            </div>
          )
        })}
      </div>

      {paymentDays.size > 0 && (
        <div style={{ marginTop: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '0.25rem', background: 'var(--accent)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {paymentDays.size} {paymentDays.size === 1 ? 'día con pago' : 'días con pagos'}
          </span>
        </div>
      )}
    </div>
  )
}
