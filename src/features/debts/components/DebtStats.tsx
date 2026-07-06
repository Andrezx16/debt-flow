import type { DebtWithPayments } from '@/types'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { TrendingDown, TrendingUp, Receipt, ArrowUpCircle, ArrowDownCircle, BarChart2 } from 'lucide-react'

interface DebtStatsProps {
  debt: DebtWithPayments
}

export function DebtStats({ debt }: DebtStatsProps) {
  const approvedPayments = debt.payments.filter((p) => p.status === 'approved')
  const amounts = approvedPayments.map((p) => p.amount)

  const maxPayment = amounts.length > 0 ? Math.max(...amounts) : 0
  const minPayment = amounts.length > 0 ? Math.min(...amounts) : 0
  const avgPayment = amounts.length > 0 ? amounts.reduce((s, a) => s + a, 0) / amounts.length : 0

  const items = [
    { label: 'Total pagado', value: formatCurrency(debt.amount_paid), icon: TrendingUp, color: 'var(--status-success)' },
    { label: 'Saldo restante', value: formatCurrency(debt.remaining), icon: TrendingDown, color: 'var(--status-warning)' },
    { label: 'Número de pagos', value: String(approvedPayments.length), icon: Receipt, color: 'var(--accent)' },
    { label: 'Mayor pago', value: maxPayment > 0 ? formatCurrency(maxPayment) : '—', icon: ArrowUpCircle, color: 'var(--accent)' },
    { label: 'Menor pago', value: minPayment > 0 ? formatCurrency(minPayment) : '—', icon: ArrowDownCircle, color: 'var(--status-info)' },
    { label: 'Promedio por pago', value: avgPayment > 0 ? formatCurrency(avgPayment) : '—', icon: BarChart2, color: 'var(--status-info)' },
    { label: 'Porcentaje pagado', value: formatPercentage(debt.percentage), icon: BarChart2, color: 'var(--accent)' },
  ]

  return (
    <div className="clay-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Estadísticas
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Icon size={15} style={{ color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
            </div>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-geist-sans)' }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
