import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function submitRegistration(payload: {
  full_name: string
  email: string
  mpesa_transaction_code: string
}) {
  const { data, error } = await supabase.functions.invoke('upsert-registration-by-email', {
    body: payload,
  })
  if (error) throw new Error(error.message)
  return data
}
