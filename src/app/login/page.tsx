import { LoginForm } from '@/features/auth/components/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Acceso al panel de administrador de DebtFlow',
}

export default function LoginPage() {
  return <LoginForm />
}
