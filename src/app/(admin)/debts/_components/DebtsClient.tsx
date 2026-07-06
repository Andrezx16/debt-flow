'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Debt } from '@/types'
import { DebtList } from '@/features/debts/components/DebtList'
import { Modal } from '@/components/ui/Modal'
import { DebtForm } from '@/features/debts/components/DebtForm'
import { toast } from 'sonner'

interface DebtsClientProps {
  initialDebts: Debt[]
}

export function DebtsClient({ initialDebts }: DebtsClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-5 md:gap-8 p-5 md:p-8 max-w-[1200px] w-full mx-auto">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
              Deudas
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              {initialDebts.length} {initialDebts.length === 1 ? 'deuda registrada' : 'deudas registradas'}
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="clay-btn"
            id="new-debt-btn"
          >
            <Plus size={18} />
            Nueva Deuda
          </button>
        </div>

        <DebtList initialDebts={initialDebts} />
      </div>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nueva Deuda">
        <DebtForm
          onSuccess={() => {
            setIsCreateOpen(false)
            toast.success('Deuda creada exitosamente')
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
    </>
  )
}
