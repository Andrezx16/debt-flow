'use client'

import { useState } from 'react'
import type { DebtWithPayments } from '@/types'
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { PaymentHistory } from '@/features/payments/components/PaymentHistory'
import { PaymentModal } from '@/features/payments/components/PaymentModal'
import { CelebrationOverlay } from '@/components/shared/CelebrationOverlay'
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher'
import { TrendingUp, Plus, Clock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface DebtorPortalProps {
  debt: DebtWithPayments
}

export function DebtorPortal({ debt }: DebtorPortalProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const isCompleted = debt.status === 'completed'

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '0.5rem',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={15} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            DebtFlow
          </span>
        </div>
        <ThemeSwitcher />
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '680px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Celebration */}
        {isCompleted && (
          <CelebrationOverlay show={true} debtorName={debt.debtor_name} />
        )}

        {/* Hero card */}
        <div className="clay-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Identity + status */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 w-full">
            <div className="text-center md:text-left">
              <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
                Hola, {debt.debtor_name} 👋
              </h1>
              {debt.description && (
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{debt.description}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-disabled)', marginTop: '0.375rem' }}>
                Desde el {formatDate(debt.created_at)}
              </p>
            </div>
            <span className={`clay-badge ${isCompleted ? 'clay-badge-completed' : 'clay-badge-active'}`} style={{ flexShrink: 0 }}>
              {isCompleted ? <CheckCircle size={12} /> : <Clock size={12} />}
              {isCompleted ? 'Completada' : 'Activa'}
            </span>
          </div>

          {/* Progress ring + amounts */}
          <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center w-full">
            <ProgressRing
              percentage={debt.percentage}
              size={140}
              strokeWidth={12}
              color={isCompleted ? 'var(--status-success)' : 'var(--accent)'}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.375rem', fontWeight: 800, color: isCompleted ? 'var(--status-success)' : 'var(--accent)', lineHeight: 1 }}>
                  {formatPercentage(debt.percentage)}
                </p>
                <p style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-disabled)', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                  PAGADO
                </p>
              </div>
            </ProgressRing>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-center sm:text-left">
              {[
                { label: 'Monto inicial', value: formatCurrency(debt.total_amount), color: 'var(--text-secondary)' },
                { label: 'Ya pagaste', value: formatCurrency(debt.amount_paid), color: 'var(--status-success)' },
                { label: 'Te falta', value: formatCurrency(debt.remaining), color: isCompleted ? 'var(--status-success)' : 'var(--accent)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: 'var(--bg-base)', padding: '1rem 0.7rem', borderRadius: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-disabled)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <ProgressBar
            percentage={debt.percentage}
            height={10}
            color={isCompleted ? 'var(--status-success)' : undefined}
          />

          {/* Pay button */}
          {!isCompleted && (
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="clay-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '1rem' }}
              id="register-payment-btn"
            >
              <Plus size={20} />
              Registrar un Pago
            </button>
          )}
        </div>

        {/* Payment history */}
        <div className="clay-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Historial de Pagos
          </h2>
            <PaymentHistory payments={debt.payments} debtId={debt.id} isAdmin={false} />
        </div>

        {/* Pending notice */}
        {debt.requires_confirmation && debt.payments.some(p => p.status === 'pending') && (
          <div style={{ padding: '1rem 1.25rem', background: 'var(--status-warning-bg)', borderRadius: '1rem', border: '1px solid var(--status-warning)' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--status-warning)', marginBottom: '0.25rem' }}>
              Tienes pagos pendientes de aprobación
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--status-warning)', opacity: 0.9 }}>
              Tus pagos serán aplicados una vez que el administrador los apruebe.
            </p>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
          Gestionado con DebtFlow
        </p>
      </footer>

      <PaymentModal
        debtId={debt.id}
        debtRemaining={debt.remaining}
        requiresConfirmation={debt.requires_confirmation}
        isPublic={true}
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={() => toast.success(
          debt.requires_confirmation
            ? 'Pago enviado — esperando aprobación'
            : 'Pago registrado exitosamente'
        )}
      />
    </div>
  )
}
