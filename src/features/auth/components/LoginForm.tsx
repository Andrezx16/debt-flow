'use client'

import { useState, useTransition } from 'react'
import { signIn } from '../actions'
import { Eye, EyeOff, TrendingUp, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signIn(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
      }}
    >
      {/* Theme toggle top-right */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <ThemeSwitcher />
      </div>

      {/* Background decorative blobs */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: '-20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'var(--accent-muted)',
          filter: 'blur(80px)',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'fixed',
          bottom: '-15%',
          right: '-10%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'var(--accent-muted)',
          filter: 'blur(80px)',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '1rem',
              background: 'var(--accent)',
              boxShadow: 'var(--clay-shadow)',
              marginBottom: '1rem',
            }}
          >
            <TrendingUp size={28} color="white" />
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            DebtFlow
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginTop: '0.375rem',
            }}
          >
            Panel de administrador
          </p>
        </div>

        {/* Card */}
        <div className="clay-elevated" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label
                htmlFor="email"
                style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@ejemplo.com"
                className="clay-input"
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label
                htmlFor="password"
                style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
              >
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="clay-input"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: 'absolute',
                    right: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'var(--status-danger-bg)',
                  color: 'var(--status-danger)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  border: '1px solid var(--status-danger)',
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="clay-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.75rem',
                fontSize: '0.9375rem',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-disabled)',
            marginTop: '1.5rem',
          }}
        >
          Solo el administrador tiene acceso a este panel.
        </p>
      </motion.div>
    </div>
  )
}
