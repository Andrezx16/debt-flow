import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        gap: '1.5rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '4rem',
          fontWeight: 900,
          color: 'var(--accent)',
          letterSpacing: '-0.05em',
          lineHeight: 1,
        }}
      >
        404
      </div>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Página no encontrada
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          El enlace que buscas no existe o ha sido eliminado.
        </p>
      </div>
      <Link href="/dashboard" className="clay-btn">
        Ir al Dashboard
      </Link>
    </div>
  )
}
