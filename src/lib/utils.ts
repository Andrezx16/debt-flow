/**
 * Format a number as Colombian Peso currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a percentage value
 */
export function formatPercentage(value: number): string {
  return `${Math.min(100, Math.max(0, value)).toFixed(1)}%`
}

/**
 * Format a date string to a localized date
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

/**
 * Format a date string to a short date
 */
export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr))
}

/**
 * Format relative time (e.g., "hace 2 días")
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 30) return formatDateShort(dateStr)
  if (diffDays > 0) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  if (diffHours > 0) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffMins > 0) return `hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  return 'hace un momento'
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Generate the full public URL for a debt token
 */
export function getDebtPublicUrl(token: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base}/debt/${token}`
}

/**
 * Merge class names (lightweight cn utility)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
