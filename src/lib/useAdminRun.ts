import { useCallback } from 'react'
import { expireSession } from './auth'
import { AuthExpiredError } from './happening'
import { supabase } from './supabase'
import type { RunAction } from './types/ui'
import type { Toast } from './useToast'

/** Wraps admin writes: toast on success/failure, and sign out if the server says the session is gone. */
export function useAdminRun(push: (tone: Toast['tone'], message: string) => void, onSuccess?: () => void): RunAction {
  return useCallback(
    async (action, successMessage) => {
      try {
        await action()
        push('success', successMessage)
        onSuccess?.()
        return true
      } catch (err) {
        if (err instanceof AuthExpiredError) {
          await handleRejected(err, push)
        } else {
          push('error', err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        }
        return false
      }
    },
    [push, onSuccess],
  )
}

/**
 * A rejected write only means the session expired if the auth server agrees. A valid session that
 * still gets "row-level security" errors is a policy problem, and signing out would not fix it.
 */
async function handleRejected(err: AuthExpiredError, push: (tone: Toast['tone'], message: string) => void) {
  const { data, error } = await supabase.auth.getUser()
  if (data.user && !error) {
    push('error', `The server refused this${err.detail ? ` (${err.detail})` : ''}. You are still signed in; the access policies (supabase/happening.sql, or supabase/storage.sql for photos) may need to be run again.`)
  } else if (error && (error.name === 'AuthRetryableFetchError' || error.status === 0)) {
    push('error', "Can't reach the server. Check your connection and try again.")
  } else {
    push('error', err.message)
    await expireSession()
  }
}
