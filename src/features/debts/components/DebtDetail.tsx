'use client'

import { useState, useTransition } from 'react'
import type { DebtWithPayments } from '@/types'
import { formatCurrency, formatPercentage, formatDate, getDebtPublicUrl } from '@/lib/utils'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { PaymentHistory } from '@/features/payments/components/PaymentHistory'
import { PaymentModal } from '@/features/payments/components/PaymentModal'
import { DebtStats } from './DebtStats'
import { CalendarCard } from '@/components/shared/CalendarCard'
import { CelebrationOverlay } from '@/components/shared/CelebrationOverlay'
import {
  Link as LinkIcon, RefreshCw, Plus, Download, ChevronLeft,
  FileText, FileSpreadsheet, File
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { regenerateToken } from '../actions'
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/export'
import { QRCodeSVG } from 'qrcode.react'
import { Modal } from '@/components/ui/Modal'

interface DebtDetailProps {
  debt: DebtWithPayments
}

export function DebtDetail({ debt }: DebtDetailProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isQrOpen, setIsQrOpen] = useState(false)
  const [isRegenerating, startRegenerate] = useTransition()

  const publicUrl = getDebtPublicUrl(debt.public_token)
  const isCompleted = debt.status === 'completed'

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(publicUrl)
    toast.success('Enlace copiado')
  }

  const handleRegenerate = () => {
    startRegenerate(async () => {
      const result = await regenerateToken(debt.id)
      if (result.error) toast.error(result.error)
      else toast.success('Enlace regenerado exitosamente')
    })
  }

  return (
    <>
      <div id="debt-detail-export" className="flex flex-col gap-5 md:gap-8 p-5 md:p-8 max-w-[1100px] w-full mx-auto">
        {/* Back + actions bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/debts" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            <ChevronLeft size={16} /> Volver a Deudas
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={handleCopyLink} className="clay-btn-ghost" style={{ fontSize: '0.8125rem' }}>
              <LinkIcon size={15} /> Copiar Enlace
            </button>
            <button onClick={() => setIsQrOpen(true)} className="clay-btn-ghost" style={{ fontSize: '0.8125rem' }}>
              QR
            </button>
            <button onClick={handleRegenerate} disabled={isRegenerating} className="clay-btn-ghost" style={{ fontSize: '0.8125rem' }}>
              <RefreshCw size={15} style={isRegenerating ? { animation: 'spin 1s linear infinite' } : {}} />
              Regenerar enlace
            </button>
            <div style={{ position: 'relative' }}>
              <details style={{ listStyle: 'none' }}>
                <summary className="clay-btn-ghost" style={{ cursor: 'pointer', fontSize: '0.8125rem', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={15} /> Exportar
                </summary>
                <div className="clay-elevated" style={{ position: 'absolute', right: 0, top: '110%', minWidth: '160px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 20 }}>
                  <button onClick={() => exportToCSV(debt)} className="clay-btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8125rem' }}>
                    <FileText size={14} /> CSV
                  </button>
                  <button onClick={() => exportToExcel(debt)} className="clay-btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8125rem' }}>
                    <FileSpreadsheet size={14} /> Excel
                  </button>
                  <button onClick={() => exportToPDF(debt, 'debt-detail-export')} className="clay-btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8125rem' }}>
                    <File size={14} /> PDF
                  </button>
                </div>
              </details>
            </div>
            {!isCompleted && (
              <button onClick={() => setIsPaymentOpen(true)} className="clay-btn">
                <Plus size={16} /> Registrar Pago
              </button>
            )}
          </div>
        </div>

        {/* Celebration */}
        {isCompleted && <CelebrationOverlay show={true} debtorName={debt.debtor_name} />}

        {/* Summary card */}
        <div className="clay-card flex flex-col md:grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center p-6 md:p-8">
          <ProgressRing percentage={debt.percentage} size={140} strokeWidth={12}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.375rem', fontWeight: 800, color: isCompleted ? 'var(--status-success)' : 'var(--accent)', lineHeight: 1 }}>
                {formatPercentage(debt.percentage)}
              </p>
              <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                PAGADO
              </p>
            </div>
          </ProgressRing>

          <div className="flex flex-col gap-4 w-full text-center md:text-left">
            <div>
              <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
                {debt.debtor_name}
              </h1>
              {debt.description && (
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{debt.description}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-disabled)', marginTop: '0.375rem' }}>
                Creado el {formatDate(debt.created_at)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full">
              {[
                { label: 'Total', value: formatCurrency(debt.total_amount) },
                { label: 'Pagado', value: formatCurrency(debt.amount_paid) },
                { label: 'Restante', value: formatCurrency(debt.remaining) },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'var(--bg-base)', padding: '0.875rem 1rem', borderRadius: '1rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-disabled)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</p>
                </div>
              ))}
            </div>

            <ProgressBar percentage={debt.percentage} height={10} color={isCompleted ? 'var(--status-success)' : undefined} />
          </div>
        </div>

        {/* Grid: stats + calendar | payment history */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <DebtStats debt={debt} />
            <CalendarCard payments={debt.payments} />
          </div>

          <div className="clay-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Historial de Pagos
            </h3>
            <PaymentHistory payments={debt.payments} debtId={debt.id} isAdmin={true} />
          </div>
        </div>
      </div>

      <PaymentModal
        debtId={debt.id}
        debtRemaining={debt.remaining}
        requiresConfirmation={debt.requires_confirmation}
        isPublic={false}
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={() => toast.success('Pago registrado')}
      />

      {/* QR Modal */}
      <Modal open={isQrOpen} onClose={() => setIsQrOpen(false)} title="Código QR del enlace" maxWidth={340}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem' }}>
            <QRCodeSVG value={publicUrl} size={200} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', wordBreak: 'break-all' }}>
            {publicUrl}
          </p>
          <button onClick={handleCopyLink} className="clay-btn" style={{ width: '100%', justifyContent: 'center' }}>
            <LinkIcon size={15} /> Copiar Enlace
          </button>
        </div>
      </Modal>
    </>
  )
}
