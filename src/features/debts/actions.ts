'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { CreateDebtInput, UpdateDebtInput } from '@/types'

const createDebtSchema = z.object({
  debtor_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  total_amount: z.number().min(1000, 'El monto mínimo es $1.000 COP'),
  requires_confirmation: z.boolean(),
})

const updateDebtSchema = createDebtSchema.partial()

export async function createDebt(input: CreateDebtInput) {
  const parsed = createDebtSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('debts')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/debts')
  return { data }
}

export async function updateDebt(id: string, input: UpdateDebtInput) {
  const parsed = updateDebtSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('debts')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/debts')
  revalidatePath(`/debts/${id}`)
  return { data }
}

export async function deleteDebt(id: string) {
  const supabase = await createClient()
  // Soft delete
  const { error } = await supabase
    .from('debts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/debts')
  return { success: true }
}

export async function regenerateToken(id: string) {
  const supabase = await createClient()
  // Call a raw SQL function to generate a new token
  const { data: tokenData, error: tokenError } = await supabase
    .rpc('generate_public_token')

  if (tokenError) return { error: tokenError.message }

  const { data, error } = await supabase
    .from('debts')
    .update({ public_token: tokenData })
    .eq('id', id)
    .select('public_token')
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/debts/${id}`)
  return { data }
}
