'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/Modal'
import { deleteDebt } from '../actions'
import type { Debt } from '@/types'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteDebtDialogProps {
  debt: Debt | null
  open: boolean
  onClose: () => void
}

export function DeleteDebtDialog({ debt, open, onClose }: DeleteDebtDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    if (!debt) return
    setError(null)
    startTransition(async () => {
      const result = await deleteDebt(debt.id)
      if (result.error) {
        setError(result.error)
      } else {
        toast.success('Deuda eliminada exitosamente')
        onClose()
      }
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Eliminar Deuda">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'var(--status-danger-bg)', padding: '1rem', borderRadius: '0.875rem' }}>
          <div style={{ color: 'var(--status-danger)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--status-danger)', marginBottom: '0.25rem' }}>
              ¿Estás seguro?
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', opacity: 0.8 }}>
              Estás a punto de eliminar la deuda de <strong>{debt?.debtor_name}</strong>. Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'var(--status-danger-bg)', color: 'var(--status-danger)', borderRadius: '0.75rem', fontSize: '0.8125rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="clay-btn-ghost">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="clay-btn-danger"
            style={{ opacity: isPending ? 0.7 : 1 }}
          >
            {isPending && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  )
}
