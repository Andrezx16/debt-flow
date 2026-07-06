import { TrendingUp, CreditCard, FileText } from 'lucide-react'

type EmptyVariant = 'debts' | 'payments' | 'search'

interface EmptyStateProps {
  variant?: EmptyVariant
  title?: string
  description?: string
  action?: React.ReactNode
}

const VARIANTS = {
  debts: {
    icon: CreditCard,
    title: 'Sin deudas aún',
    description: 'Crea tu primera deuda para comenzar a registrar préstamos.',
  },
  payments: {
    icon: TrendingUp,
    title: 'Sin pagos registrados',
    description: 'Los pagos aparecerán aquí una vez que sean registrados.',
  },
  search: {
    icon: FileText,
    title: 'Sin resultados',
    description: 'No encontramos deudas que coincidan con tu búsqueda.',
  },
}

export function EmptyState({
  variant = 'debts',
  title,
  description,
  action,
}: EmptyStateProps) {
  const defaults = VARIANTS[variant]
  const Icon = defaults.icon

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '1rem',
          background: 'var(--accent-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
        }}
      >
        <Icon size={24} />
      </div>
      <div>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.375rem',
          }}
        >
          {title ?? defaults.title}
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            maxWidth: '28ch',
          }}
        >
          {description ?? defaults.description}
        </p>
      </div>
      {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
    </div>
  )
}
