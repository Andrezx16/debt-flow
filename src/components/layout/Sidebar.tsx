'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  LogOut,
} from 'lucide-react'
import { signOut } from '@/features/auth/actions'
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/debts', label: 'Deudas', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100dvh',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        gap: '0.25rem',
        flexShrink: 0,
        boxShadow: '2px 0 16px rgba(0,0,0,0.04)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.25rem 0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '0.625rem',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <TrendingUp size={18} color="white" />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
          }}
        >
          DebtFlow
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.875rem',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-muted)' : 'transparent',
                textDecoration: 'none',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: theme + signout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <ThemeSwitcher />
        <form action={signOut}>
          <button
            type="submit"
            className="clay-btn-ghost"
            style={{ width: '100%', padding: '0.5rem 0.75rem', justifyContent: 'flex-start', fontSize: '0.875rem' }}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
