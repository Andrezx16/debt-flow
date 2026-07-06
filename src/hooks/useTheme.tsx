'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'clay-light' | 'clay-dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('clay-light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('debtflow-theme') as Theme | null
    if (saved === 'clay-light' || saved === 'clay-dark') {
      setThemeState(saved)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('clay-dark')
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('debtflow-theme', theme)
  }, [theme, mounted])

  const setTheme = (t: Theme) => setThemeState(t)
  const toggleTheme = () =>
    setThemeState((prev) => (prev === 'clay-light' ? 'clay-dark' : 'clay-light'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
