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

export type PublicRegistration = {
  name: string
  email: string
  mpesa_code: string
}

// Plain fetch: the function's CORS policy only allows authorization/apikey/content-type,
// so supabase.functions.invoke (which adds x-client-info) would fail the preflight.
// The endpoint pages with limit (max 100) / offset and returns next_offset until exhausted.
export async function fetchRegistrations() {
  const all: PublicRegistration[] = []
  let offset: number | null = 0

  while (offset !== null) {
    const res = await fetch(
      `${supabaseUrl}/functions/v1/public-registration-data?limit=100&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
      },
    )
    const body = (await res.json().catch(() => null)) as {
      data?: PublicRegistration[]
      next_offset?: number | null
      error?: string
      message?: string
    } | null
    if (!res.ok) throw new Error(body?.error ?? body?.message ?? `Request failed (${res.status})`)

    all.push(...(body?.data ?? []))
    offset = body?.next_offset ?? null
  }

  return all
}

export async function submitFeedback(payload: { name: string | null; rating: number | null; message: string }) {
  const { error } = await supabase.from('feedback').insert(payload)
  if (error) throw new Error(error.code === '23514' ? 'Please check your message and try again.' : error.message)
}

export type FeedbackEntry = {
  id: string
  name: string | null
  rating: number | null
  message: string
  created_at: string
}

export async function fetchFeedback() {
  const { data, error } = await supabase
    .from('feedback')
    .select('id, name, rating, message, created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as FeedbackEntry[]
}
