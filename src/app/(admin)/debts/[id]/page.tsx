import { getDebtById } from '@/features/debts/queries'
import { DebtDetail } from '@/features/debts/components/DebtDetail'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface DebtPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: DebtPageProps): Promise<Metadata> {
  const { id } = await params
  const debt = await getDebtById(id)
  return { title: debt ? `Deuda · ${debt.debtor_name}` : 'Deuda no encontrada' }
}

export default async function DebtPage({ params }: DebtPageProps) {
  const { id } = await params
  const debt = await getDebtById(id)

  if (!debt) notFound()

  return <DebtDetail debt={debt} />
}
