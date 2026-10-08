import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

// The 4th annual (2027) conference lives in its own Supabase project; see supabase/next_conference.sql.
// No session: visitors register anonymously, and a second auth client would clash with the admin one.
export const fourthConference = createClient(
  import.meta.env.VITE_FOURTH_URL as string,
  import.meta.env.VITE_PUBLISHABLE_KEY as string,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
)

export type FourthRegistration = {
  name: string
  phone: string
  mpesa_code: string | null
  area: string
  created_at: string
}

/** Kenyan numbers in any common form (0712…, 712…, +254712…) become 254712345678. */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/[^\d+]/g, '').replace(/^\+/, '')
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`
  return digits
}

/** 254712345678 → 0712 345 678; anything else is shown as stored. */
export function formatPhone(phone: string) {
  const m = /^254(\d{3})(\d{3})(\d{3})$/.exec(phone)
  return m ? `0${m[1]} ${m[2]} ${m[3]}` : phone
}

// The visitor's own phone number, so they can come back to their registration on this device.
const PHONE_KEY = 'aic-2027-registration-phone'

export function getSavedPhone() {
  try {
    return localStorage.getItem(PHONE_KEY)
  } catch {
    return null
  }
}

export function savePhone(phone: string) {
  try {
    localStorage.setItem(PHONE_KEY, phone)
  } catch {
    // Private mode / blocked storage: the registration still went through.
  }
}

export function forgetPhone() {
  try {
    localStorage.removeItem(PHONE_KEY)
  } catch {
    // Nothing stored.
  }
}

/**
 * Registers a pastor, or updates the registration this phone already has (see register() in
 * supabase/next_conference.sql). `updated` says which happened.
 */
export async function submitFourthRegistration(payload: Omit<FourthRegistration, 'created_at'>) {
  const { data, error } = await fourthConference.rpc('register', {
    p_name: payload.name,
    p_phone: payload.phone,
    p_mpesa_code: payload.mpesa_code ?? '',
    p_area: payload.area,
  })
  if (error) {
    if (error.code === '23514') throw new Error('Please check your details and try again.')
    throw new Error(error.message)
  }
  const row = ((data ?? []) as (FourthRegistration & { updated: boolean })[])[0]
  if (!row) throw new Error('Something went wrong. Please try again.')
  const { updated, ...registration } = row
  return { registration, updated }
}

/** The registration for one (normalised) phone number, or null if there is none. */
export async function fetchMyRegistration(phone: string) {
  const { data, error } = await fourthConference.rpc('my_registration', { p_phone: phone })
  if (error) throw new Error(error.message)
  return ((data ?? []) as FourthRegistration[])[0] ?? null
}

/** Every 4th conference registration, for signed-in admins (through the main project's edge function). */
export async function fetchFourthRegistrations() {
  const { data, error } = await supabase.functions.invoke('fourth-registrations')
  if (error) throw new Error(error.message)
  return ((data as { data?: FourthRegistration[] } | null)?.data ?? [])
}
