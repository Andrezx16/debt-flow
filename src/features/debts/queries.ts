import { createClient } from '@/lib/supabase/server'
import type { Debt, DebtWithPayments, DebtStats } from '@/types'

export async function getDebts(): Promise<Debt[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('debts')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getDebtById(id: string): Promise<DebtWithPayments | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('debts')
    .select(`*, payments(*)`)
    .eq('id', id)
    .is('deleted_at', null)
    .order('payment_date', { referencedTable: 'payments', ascending: false })
    .single()

  if (error) return null
  return data as DebtWithPayments
}

export async function getDebtByToken(token: string): Promise<DebtWithPayments | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('debts')
    .select(`*, payments(*)`)
    .eq('public_token', token)
    .is('deleted_at', null)
    .order('payment_date', { referencedTable: 'payments', ascending: false })
    .single()

  if (error) return null
  return data as DebtWithPayments
}

export async function getDashboardStats(): Promise<DebtStats> {
  const supabase = await createClient()

  const { data: debts, error } = await supabase
    .from('debts')
    .select('total_amount, amount_paid, status')
    .is('deleted_at', null)

  if (error) throw new Error(error.message)

  const { count: paymentsCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  const all = debts ?? []
  const total_lent = all.reduce((s, d) => s + d.total_amount, 0)
  const total_recovered = all.reduce((s, d) => s + d.amount_paid, 0)
  const total_pending = total_lent - total_recovered
  const active_debts = all.filter((d) => d.status === 'active').length
  const completed_debts = all.filter((d) => d.status === 'completed').length

  return {
    total_lent,
    total_recovered,
    total_pending,
    total_debts: all.length,
    total_payments: paymentsCount ?? 0,
    avg_recovery: all.length > 0 ? (total_recovered / total_lent) * 100 : 0,
    active_debts,
    completed_debts,
  }
}
