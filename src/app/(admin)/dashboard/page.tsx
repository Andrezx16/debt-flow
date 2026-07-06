import { getDashboardStats, getDebts } from '@/features/debts/queries'
import { StatsCard } from '@/components/shared/StatsCard'
import { RecoveryPieChart, DebtBarChart } from '@/features/dashboard/components/Charts'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Receipt,
  Percent,
  CheckCircle,
  Clock,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const [stats, debts] = await Promise.all([getDashboardStats(), getDebts()])

  const statCards = [
    { label: 'Total prestado', value: stats.total_lent, formatType: 'currency' as const, icon: TrendingUp, color: 'var(--accent)' },
    { label: 'Total recuperado', value: stats.total_recovered, formatType: 'currency' as const, icon: TrendingDown, color: 'var(--status-success)' },
    { label: 'Saldo pendiente', value: stats.total_pending, formatType: 'currency' as const, icon: Wallet, color: 'var(--status-warning)' },
    { label: 'Total deudas', value: stats.total_debts, formatType: 'number' as const, icon: CreditCard, color: 'var(--accent)' },
    { label: 'Total pagos', value: stats.total_payments, formatType: 'number' as const, icon: Receipt, color: 'var(--status-info)' },
    { label: 'Recuperación promedio', value: stats.avg_recovery, formatType: 'percentage' as const, icon: Percent, color: 'var(--accent)' },
    { label: 'Deudas activas', value: stats.active_debts, formatType: 'number' as const, icon: Clock, color: 'var(--status-warning)' },
    { label: 'Deudas finalizadas', value: stats.completed_debts, formatType: 'number' as const, icon: CheckCircle, color: 'var(--status-success)' },
  ]

  const barData = debts.map((d) => ({
    debtor_name: d.debtor_name,
    total_amount: d.total_amount,
    amount_paid: d.amount_paid,
  }))

  return (
    <div className="flex flex-col gap-5 md:gap-8 p-5 md:p-8 max-w-[1200px] w-full mx-auto">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Resumen general de tus préstamos
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {statCards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts row */}
      {debts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <RecoveryPieChart stats={stats} />
          <DebtBarChart debts={barData} />
        </div>
      )}
    </div>
  )
}
