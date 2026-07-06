'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MoreVertical, Edit2, Trash2, Link as LinkIcon, Eye } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, formatPercentage, getDebtPublicUrl } from '@/lib/utils'
import { ProgressBar } from '@/components/shared/ProgressBar'
import type { Debt } from '@/types'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { DebtForm } from './DebtForm'

interface DebtCardProps {
  debt: Debt
  onDeleteClick: (debt: Debt) => void
}

export function DebtCard({ debt, onDeleteClick }: DebtCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const isCompleted = debt.status === 'completed'

  const handleCopyLink = async () => {
    const url = getDebtPublicUrl(debt.public_token)
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Enlace copiado al portapapeles')
      setIsMenuOpen(false)
    } catch (err) {
      toast.error('Error al copiar el enlace')
    }
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="clay-card"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {debt.debtor_name}
            </h3>
            {debt.description && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {debt.description}
              </p>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}
            >
              <MoreVertical size={20} />
            </button>

            {isMenuOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                  onClick={() => setIsMenuOpen(false)}
                />
                <div
                  className="clay-elevated"
                  style={{ position: 'absolute', right: 0, top: '100%', minWidth: '160px', zIndex: 11, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
                >
                  <button onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false) }} className="clay-btn-ghost" style={{ justifyContent: 'flex-start', padding: '0.5rem', fontSize: '0.8125rem' }}>
                    <Edit2 size={14} /> Editar
                  </button>
                  <button onClick={handleCopyLink} className="clay-btn-ghost" style={{ justifyContent: 'flex-start', padding: '0.5rem', fontSize: '0.8125rem' }}>
                    <LinkIcon size={14} /> Copiar Enlace
                  </button>
                  <button onClick={() => { onDeleteClick(debt); setIsMenuOpen(false) }} className="clay-btn-ghost" style={{ justifyContent: 'flex-start', padding: '0.5rem', fontSize: '0.8125rem', color: 'var(--status-danger)' }}>
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Amounts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-base)', padding: '1rem', borderRadius: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>PRESTADO</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(debt.total_amount)}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>RESTANTE</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: isCompleted ? 'var(--status-success)' : 'var(--accent)' }}>
              {formatCurrency(debt.remaining)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>PROGRESO</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatPercentage(debt.percentage)}</span>
          </div>
          <ProgressBar percentage={debt.percentage} color={isCompleted ? 'var(--status-success)' : undefined} />
        </div>

        {/* Action */}
        <div style={{ marginTop: '0.5rem' }}>
          <Link href={`/debts/${debt.id}`} className="clay-btn" style={{ width: '100%', justifyContent: 'center' }}>
            <Eye size={16} /> Ver Detalles
          </Link>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Deuda">
        <DebtForm
          initialData={debt}
          onSuccess={() => {
            setIsEditModalOpen(false)
            toast.success('Deuda actualizada exitosamente')
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </>
  )
}
