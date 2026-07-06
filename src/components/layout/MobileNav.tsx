'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CreditCard, TrendingUp, LogOut } from 'lucide-react'
import { signOut } from '@/features/auth/actions'
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/debts', label: 'Deudas', icon: CreditCard },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile top bar */}
      <header
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
        className="flex md:hidden w-full"
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

      {/* Mobile bottom nav */}
      <nav
        className="flex md:hidden"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          padding: '0.5rem 0.5rem 0.75rem',
          zIndex: 50,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.875rem',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.6875rem',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <Icon size={20} />
                {label}
              </Link>
            )
          })}
          <form action={signOut}>
            <button
              type="submit"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.875rem',
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.6875rem',
                fontWeight: 400,
              }}
            >
              <LogOut size={20} />
              Salir
            </button>
          </form>
        </div>
      </nav>
    </>
  )
}
