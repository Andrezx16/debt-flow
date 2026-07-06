import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
  rounded?: boolean
}

export function Skeleton({ className, style, rounded }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{
        borderRadius: rounded ? '999px' : '0.75rem',
        background: 'linear-gradient(90deg, var(--border) 25%, var(--border-strong) 50%, var(--border) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

export function DebtCardSkeleton() {
  return (
    <div className="clay-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Skeleton style={{ height: '1.25rem', width: '60%' }} />
          <Skeleton style={{ height: '0.875rem', width: '40%' }} />
        </div>
        <Skeleton rounded style={{ height: '1.5rem', width: '5rem' }} />
      </div>
      <Skeleton style={{ height: '0.5rem', width: '100%' }} rounded />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton style={{ height: '1rem', width: '35%' }} />
        <Skeleton style={{ height: '1rem', width: '30%' }} />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="clay-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Skeleton style={{ height: '0.875rem', width: '55%' }} />
      <Skeleton style={{ height: '2rem', width: '70%' }} />
      <Skeleton style={{ height: '0.75rem', width: '40%' }} />
    </div>
  )
}
