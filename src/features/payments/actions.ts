'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createPaymentSchema = z.object({
  debt_id: z.string().uuid(),
  amount: z.number().min(1, 'El monto debe ser mayor a 0'),
  comment: z.string().optional(),
  payment_date: z.string().optional(),
  status: z.enum(['pending', 'approved']).optional(),
})

export async function createPayment(input: {
  debt_id: string
  amount: number
  comment?: string
  payment_date?: string
  status?: 'pending' | 'approved'
}) {
  const parsed = createPaymentSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payments')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/debts')
  revalidatePath(`/debts/${input.debt_id}`)
  return { data }
}

export async function approvePayment(paymentId: string, debtId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('payments')
    .update({ status: 'approved' })
    .eq('id', paymentId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath(`/debts/${debtId}`)
  return { success: true }
}

export async function rejectPayment(paymentId: string, debtId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath(`/debts/${debtId}`)
  return { success: true }
}

export async function deletePayment(paymentId: string, debtId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', paymentId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/debts')
  revalidatePath(`/debts/${debtId}`)
  return { success: true }
}

// Public action — used from the debtor portal (no auth)
export async function createPublicPayment(input: {
  debt_id: string
  amount: number
  comment?: string
  payment_date?: string
  requires_confirmation: boolean
}) {
  const status = input.requires_confirmation ? 'pending' : 'approved'
  return createPayment({ ...input, status })
}
