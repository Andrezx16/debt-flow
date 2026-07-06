'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { createDebt, updateDebt } from '../actions'
import { useForm as useReactHookForm } from 'react-hook-form'

const debtSchema = z.object({
  debtor_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  total_amount: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().min(1000, 'El monto mínimo es $1.000 COP')
  ),
  requires_confirmation: z.boolean().default(false),
})

type DebtFormValues = {
  debtor_name: string
  description?: string
  total_amount: number
  requires_confirmation: boolean
}

interface DebtFormProps {
  initialData?: {
    id: string
    debtor_name: string
    description: string | null
    total_amount: number
    requires_confirmation: boolean
  }
  onSuccess: () => void
  onCancel: () => void
}

export function DebtForm({ initialData, onSuccess, onCancel }: DebtFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useReactHookForm<DebtFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(debtSchema) as any,
    defaultValues: {
      debtor_name: initialData?.debtor_name ?? '',
      description: initialData?.description ?? '',
      total_amount: initialData?.total_amount ?? '' as any,
      requires_confirmation: initialData?.requires_confirmation ?? false,
    },
  })

  const onSubmit = (data: DebtFormValues) => {
    setError(null)
    startTransition(async () => {
      let result
      if (initialData) {
        result = await updateDebt(initialData.id, data)
      } else {
        result = await createDebt(data)
      }

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Debtor Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="debtor_name" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Nombre del deudor
        </label>
        <input
          id="debtor_name"
          {...register('debtor_name')}
          placeholder="Ej: Juan Pérez"
          className="clay-input"
        />
        {errors.debtor_name && (
          <span style={{ fontSize: '0.75rem', color: 'var(--status-danger)' }}>{errors.debtor_name.message}</span>
        )}
      </div>

      {/* Total Amount */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="total_amount" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Monto Total (COP)
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>$</span>
          <input
            id="total_amount"
            type="number"
            {...register('total_amount')}
            placeholder="500000"
            className="clay-input"
            style={{ paddingLeft: '2rem' }}
          />
        </div>
        {errors.total_amount && (
          <span style={{ fontSize: '0.75rem', color: 'var(--status-danger)' }}>{errors.total_amount.message}</span>
        )}
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="description" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Concepto del préstamo..."
          className="clay-input clay-scroll"
          style={{ minHeight: '80px', resize: 'vertical' }}
        />
      </div>

      {/* Requires Confirmation Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-base)', borderRadius: '0.875rem', border: '1px solid var(--border)' }}>
        <input
          type="checkbox"
          id="requires_confirmation"
          {...register('requires_confirmation')}
          style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent)' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="requires_confirmation" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
            Requerir confirmación
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Los pagos ingresados por el deudor deberán ser aprobados.
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '0.75rem', background: 'var(--status-danger-bg)', color: 'var(--status-danger)', borderRadius: '0.75rem', fontSize: '0.8125rem' }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button type="button" onClick={onCancel} className="clay-btn-ghost">
          Cancelar
        </button>
        <button type="submit" disabled={isPending} className="clay-btn" style={{ opacity: isPending ? 0.7 : 1 }}>
          {isPending && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
          {initialData ? 'Guardar Cambios' : 'Crear Deuda'}
        </button>
      </div>
    </form>
  )
}
