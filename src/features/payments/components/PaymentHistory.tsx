'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PaymentCard } from './PaymentCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { ArrowUpDown, Filter } from 'lucide-react'
import type { Payment } from '@/types'

interface PaymentHistoryProps {
  payments: Payment[]
  debtId: string
  isAdmin?: boolean
}

export function PaymentHistory({ payments, debtId, isAdmin = false }: PaymentHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all')
  const [sortDesc, setSortDesc] = useState(true)

  const filtered = payments.filter((p) => {
    if (filter === 'all') return true
    
    const paymentDate = new Date(p.payment_date).getTime()
    const now = new Date().getTime()
    const diffDays = (now - paymentDate) / (1000 * 60 * 60 * 24)
    
    if (filter === 'week') return diffDays <= 7
    if (filter === 'month') return diffDays <= 30
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    let diff = new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
    if (diff === 0) {
      diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return sortDesc ? diff : -diff
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Controles */}
      {payments.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'week' | 'month')}
            className="clay-input"
            style={{ padding: '0.375rem 0.5rem', fontSize: '0.8125rem', borderRadius: '0.75rem', width: 'auto' }}
          >
            <option value="all">Todo</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
          </select>

          <button 
            onClick={() => setSortDesc(!sortDesc)}
            className="clay-btn-ghost"
            style={{ padding: '0.375rem 0.5rem', borderRadius: '0.75rem' }}
            title={sortDesc ? "Más recientes primero" : "Más antiguos primero"}
          >
            <span style={{ fontSize: '0.8125rem', marginRight: '0.25rem' }}>
              {sortDesc ? 'Más recientes' : 'Más antiguos'}
            </span>
            <ArrowUpDown size={14} />
          </button>
        </div>
      )}

      {/* Lista con scroll */}
      <div 
        className="clay-scroll" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem', 
          maxHeight: '560px', 
          overflowY: 'auto', 
          paddingRight: '0.25rem',
          paddingBottom: '0.5rem' 
        }}
      >
        {sorted.length === 0 ? (
          <EmptyState variant="payments" />
        ) : (
          <AnimatePresence mode="popLayout">
            {sorted.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                debtId={debtId}
                isAdmin={isAdmin}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
