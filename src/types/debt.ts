import type { Payment } from './payment'

export type DebtStatus = 'active' | 'completed' | 'archived'
export type PaymentStatus = 'pending' | 'approved' | 'rejected'

export interface Debt {
  id: string
  public_token: string
  debtor_name: string
  description: string | null
  total_amount: number
  amount_paid: number
  remaining: number
  percentage: number
  status: DebtStatus
  requires_confirmation: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface DebtWithPayments extends Debt {
  payments: Payment[]
}

export interface CreateDebtInput {
  debtor_name: string
  description?: string
  total_amount: number
  requires_confirmation: boolean
}

export interface UpdateDebtInput {
  debtor_name?: string
  description?: string
  total_amount?: number
  requires_confirmation?: boolean
  status?: DebtStatus
}

export interface DebtStats {
  total_lent: number
  total_recovered: number
  total_pending: number
  total_debts: number
  total_payments: number
  avg_recovery: number
  active_debts: number
  completed_debts: number
}
