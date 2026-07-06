import type { PaymentStatus } from './debt'

export interface Payment {
  id: string
  debt_id: string
  amount: number
  comment: string | null
  status: PaymentStatus
  payment_date: string
  created_at: string
}

export interface CreatePaymentInput {
  debt_id: string
  amount: number
  comment?: string
  payment_date?: string
}

export interface PaymentStats {
  count: number
  total: number
  max: number
  min: number
  avg: number
}
