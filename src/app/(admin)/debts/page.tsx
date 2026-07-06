import { getDebts } from '@/features/debts/queries'
import { DebtsClient } from './_components/DebtsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Deudas' }

export default async function DebtsPage() {
  const debts = await getDebts()
  return <DebtsClient initialDebts={debts} />
}
