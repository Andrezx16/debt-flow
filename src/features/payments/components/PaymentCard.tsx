'use client'

import { useState, useTransition } from 'react'
import { Trash2, Check, X, Clock, Loader2 } from 'lucide-react'
import { formatCurrency, formatDateShort, formatRelativeTime } from '@/lib/utils'
import { deletePayment, approvePayment, rejectPayment } from '../actions'
import type { Payment } from '@/types'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface PaymentCardProps {
  payment: Payment
  debtId: string
  isAdmin?: boolean
  onDeleted?: () => void
}

const STATUS_MAP = {
  approved: { label: 'Aprobado', css: 'clay-badge-active' },
  pending:  { label: 'Pendiente', css: 'clay-badge-pending' },
  rejected: { label: 'Rechazado', css: 'clay-badge-rejected' },
}

export function PaymentCard({ payment, debtId, isAdmin = false, onDeleted }: PaymentCardProps) {
  const [isPending, startTransition] = useTransition()
  const [localStatus, setLocalStatus] = useState(payment.status)

  const { label, css } = STATUS_MAP[localStatus]

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approvePayment(payment.id, debtId)
      if (result.error) { toast.error(result.error) }
      else { setLocalStatus('approved'); toast.success('Pago aprobado') }
    })
  }

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectPayment(payment.id, debtId)
      if (result.error) { toast.error(result.error) }
      else { setLocalStatus('rejected'); toast.success('Pago rechazado') }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePayment(payment.id, debtId)
      if (result.error) { toast.error(result.error) }
      else { toast.success('Pago eliminado'); onDeleted?.() }
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="clay-card-sm"
      style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        
        {/* Main Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', alignItems: 'flex-start' }}>
          
          <div style={{ background: 'var(--accent-muted)', borderRadius: '0.75rem', padding: '0.5rem 0.875rem' }}>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
              {formatCurrency(payment.amount)}
            </p>
          </div>

          <span className={`clay-badge ${css}`}>{label}</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-disabled)', flexWrap: 'wrap', marginTop: '0.125rem' }}>
            <Clock size={14} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
              {formatDateShort(payment.payment_date)}
            </span>
            <span style={{ fontSize: '0.75rem' }}>·</span>
            <span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
              {formatRelativeTime(payment.created_at)}
            </span>
          </div>

          {payment.comment && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {payment.comment}
            </p>
          )}
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
            {localStatus === 'pending' && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={isPending}
                  title="Aprobar"
                  style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'var(--status-success-bg)', color: 'var(--status-success)', border: 'none', cursor: 'pointer' }}
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleReject}
                  disabled={isPending}
                  title="Rechazar"
                  style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'var(--status-danger-bg)', color: 'var(--status-danger)', border: 'none', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </>
            )}
            {isPending ? (
              <div style={{ padding: '0.5rem' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-disabled)' }} />
              </div>
            ) : (
              <button
                onClick={handleDelete}
                title="Eliminar pago"
                style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'transparent', color: 'var(--text-disabled)', border: 'none', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
