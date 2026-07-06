
import { NumberTicker, type FormatType } from '@/components/shared/NumberTicker'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: number
  formatType?: FormatType
  icon: LucideIcon
  color?: string
  subtitle?: string
}

export function StatsCard({ label, value, formatType, icon: Icon, color, subtitle }: StatsCardProps) {
  const accentColor = color ?? 'var(--accent)'

  return (
    <div
      className="clay-card"
      style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div style={{ width: '32px', height: '32px', borderRadius: '0.625rem', background: `color-mix(in srgb, ${accentColor} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, flexShrink: 0 }}>
          <Icon size={16} />
        </div>
      </div>

      <NumberTicker
        value={value}
        formatType={formatType}
        style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', fontFamily: 'var(--font-geist-sans)', lineHeight: 1 }}
      />

      {subtitle && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '-0.25rem' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
