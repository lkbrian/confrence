import type { AuthError, Session } from '@supabase/supabase-js'
import { useSyncExternalStore } from 'react'
import { supabase } from './supabase'

export type SessionEndReason = 'signedout' | 'expired'

// Sign-ups are disabled in Supabase, so every account that can sign in is an admin.
type AuthState = { session: Session | null; loading: boolean; endReason: SessionEndReason | null }

let state: AuthState = { session: null, loading: true, endReason: null }
let started = false
let manualSignOut = false
const listeners = new Set<() => void>()

function setState(next: AuthState) {
  state = next
  listeners.forEach((listener) => listener())
}

function resolveSession(session: Session | null) {
  if (!session) {
    const endReason = state.session ? (manualSignOut ? 'signedout' : 'expired') : state.endReason
    manualSignOut = false
    return setState({ session: null, loading: false, endReason })
  }
  setState({ session, loading: false, endReason: null })
}

function start() {
  if (started) return
  started = true
  // Fires INITIAL_SESSION immediately, then on sign-in / sign-out / refresh, in this tab and others.
  supabase.auth.onAuthStateChange((_event, session) => resolveSession(session))
}

function subscribe(listener: () => void) {
  start()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSession() {
  return useSyncExternalStore(subscribe, () => state)
}

type AuthResult = { ok: true } | { ok: false; field?: 'email' | 'code'; message: string }

const NO_ACCOUNT = 'No admin account found for that email.'

function networkOrRateLimit(error: AuthError) {
  if (error.name === 'AuthRetryableFetchError' || error.status === 0) {
    return "Can't reach the server. Check your connection and try again."
  }
  if (error.code === 'over_email_send_rate_limit') return 'A code was sent recently. Please wait a minute before requesting another.'
  if (error.status === 429 || error.code === 'over_request_rate_limit') return 'Too many attempts. Please wait a minute and try again.'
  return null
}

/** Step 1: email a one-time code to an existing admin account. */
export async function requestCode(emailInput: string): Promise<AuthResult & { email?: string }> {
  const email = emailInput.trim().toLowerCase()
  if (!email) return { ok: false, field: 'email', message: 'Email is required.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, field: 'email', message: 'Enter a valid email address.' }

  // shouldCreateUser: false — only existing (admin) accounts can receive a code.
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })
  if (error) {
    const known = networkOrRateLimit(error)
    if (known) return { ok: false, message: known }
    if (error.code === 'otp_disabled' || /signups not allowed/i.test(error.message)) return { ok: false, field: 'email', message: NO_ACCOUNT }
    return { ok: false, message: error.message }
  }
  return { ok: true, email }
}

/** Step 2: verify the emailed code and start the session. */
export async function verifyCode(email: string, code: string): Promise<AuthResult> {
  const token = code.replace(/\s/g, '')
  if (!token) return { ok: false, field: 'code', message: 'Enter the code from your email.' }
  if (!/^\d{6,8}$/.test(token)) return { ok: false, field: 'code', message: 'The code is the 6-digit number in the email.' }

  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
  if (error || !data.session) {
    const known = error && networkOrRateLimit(error)
    if (known) return { ok: false, message: known }
    if (error?.code === 'otp_expired' || /expired/i.test(error?.message ?? '')) {
      return { ok: false, field: 'code', message: 'That code is invalid or has expired. Request a new one.' }
    }
    return { ok: false, field: 'code', message: error?.message ?? 'Could not verify the code.' }
  }

  resolveSession(data.session)
  return { ok: true }
}

export async function signOut() {
  manualSignOut = true
  await supabase.auth.signOut()
}

/** Ends the session after the server rejected a write, so the login screen says it expired. */
export async function expireSession() {
  manualSignOut = false
  await supabase.auth.signOut({ scope: 'local' })
}
