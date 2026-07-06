'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import type { DebtStats } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface PieChartCardProps {
  stats: DebtStats
}

interface BarChartCardProps {
  debts: { debtor_name: string; total_amount: number; amount_paid: number }[]
}

const COLORS = ['var(--accent)', 'var(--border)']

export function RecoveryPieChart({ stats }: PieChartCardProps) {
  const data = [
    { name: 'Recuperado', value: stats.total_recovered },
    { name: 'Pendiente', value: stats.total_pending },
  ]

  return (
    <div className="clay-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Recuperación total
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => formatCurrency(Number(value))}
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              boxShadow: 'var(--clay-shadow-sm)',
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DebtBarChart({ debts }: BarChartCardProps) {
  const data = debts.slice(0, 6).map((d) => ({
    name: d.debtor_name.split(' ')[0],
    Prestado: d.total_amount,
    Pagado: d.amount_paid,
  }))

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
    return String(value)
  }

  return (
    <div className="clay-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        Deudas por deudor
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={14} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: any) => formatCurrency(Number(value))}
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              boxShadow: 'var(--clay-shadow-sm)',
            }}
          />
          <Bar dataKey="Prestado" fill="var(--border)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Pagado" fill="var(--accent)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
