'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { createPayment, createPublicPayment } from '../actions'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/lib/utils'

const paymentSchema = z.object({
  amount: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().min(1, 'El monto debe ser mayor a 0')
  ),
  comment: z.string().optional(),
  payment_date: z.string().min(1, 'La fecha es obligatoria'),
})

type PaymentFormValues = {
  amount: number
  comment?: string
  payment_date: string
}

interface PaymentModalProps {
  debtId: string
  debtRemaining: number
  requiresConfirmation: boolean
  isPublic?: boolean
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function PaymentModal({
  debtId,
  debtRemaining,
  requiresConfirmation,
  isPublic = false,
  open,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      amount: '' as unknown as number,
      comment: '',
      payment_date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = (data: PaymentFormValues) => {
    if (data.amount > debtRemaining) {
      setError(`El pago no puede superar el saldo restante (${formatCurrency(debtRemaining)})`)
      return
    }
    setError(null)
    startTransition(async () => {
      let result
      if (isPublic) {
        result = await createPublicPayment({
          debt_id: debtId,
          ...data,
          requires_confirmation: requiresConfirmation,
        })
      } else {
        result = await createPayment({ debt_id: debtId, ...data, status: 'approved' })
      }
      if (result.error) {
        setError(result.error)
      } else {
        reset()
        onClose()
        onSuccess?.()
      }
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar Pago" maxWidth={400}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Amount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="pay-amount" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Monto (COP)
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Máx: {formatCurrency(debtRemaining)}
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>$</span>
            <input id="pay-amount" type="number" min={1} {...register('amount')} placeholder="100000" className="clay-input" style={{ paddingLeft: '2rem' }} />
          </div>
          {errors.amount && <span style={{ fontSize: '0.75rem', color: 'var(--status-danger)' }}>{errors.amount.message}</span>}
        </div>

        {/* Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="pay-date" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Fecha del pago</label>
          <input id="pay-date" type="date" {...register('payment_date')} className="clay-input" />
          {errors.payment_date && <span style={{ fontSize: '0.75rem', color: 'var(--status-danger)' }}>{errors.payment_date.message}</span>}
        </div>

        {/* Comment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="pay-comment" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Comentario (opcional)</label>
          <textarea id="pay-comment" {...register('comment')} placeholder="Transferencia, efectivo…" className="clay-input clay-scroll" style={{ minHeight: '60px', resize: 'vertical' }} />
        </div>

        {/* Confirmation warning */}
        {isPublic && requiresConfirmation && (
          <div style={{ padding: '0.75rem', background: 'var(--status-warning-bg)', borderRadius: '0.875rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--status-warning)' }}>Pago sujeto a confirmación</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--status-warning)', marginTop: '0.25rem' }}>
              El administrador deberá aprobarlo antes de reflejarse en el saldo.
            </p>
          </div>
        )}

        {error && (
          <div style={{ padding: '0.75rem', background: 'var(--status-danger-bg)', color: 'var(--status-danger)', borderRadius: '0.875rem', fontSize: '0.8125rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="clay-btn-ghost">Cancelar</button>
          <button type="submit" disabled={isPending} className="clay-btn" style={{ opacity: isPending ? 0.7 : 1 }}>
            {isPending && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            Registrar Pago
          </button>
        </div>
      </form>
    </Modal>
  )
}
