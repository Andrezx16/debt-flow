'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Cambiar a tema ${theme === 'clay-light' ? 'oscuro' : 'claro'}`}
      className="clay-card-sm"
      style={{
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        transition: 'color 0.15s ease',
      }}
    >
      {theme === 'clay-light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
