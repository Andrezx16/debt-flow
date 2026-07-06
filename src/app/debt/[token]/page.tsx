import { getDebtByToken } from '@/features/debts/queries'
import { DebtorPortal } from '@/features/debts/components/DebtorPortal'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface DebtTokenPageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: DebtTokenPageProps): Promise<Metadata> {
  const { token } = await params
  const debt = await getDebtByToken(token)
  if (!debt) return { title: 'Enlace no válido' }
  return {
    title: `Tu deuda — DebtFlow`,
    description: `Consulta el estado de tu deuda con ${debt.debtor_name}.`,
  }
}

export default async function DebtTokenPage({ params }: DebtTokenPageProps) {
  const { token } = await params
  const debt = await getDebtByToken(token)

  if (!debt) notFound()

  return <DebtorPortal debt={debt} />
}
