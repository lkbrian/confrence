import { useCallback } from 'react'
import { expireSession } from './auth'
import { AuthExpiredError } from './happening'
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
          push('error', err.message)
          await expireSession()
        } else {
          push('error', err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        }
        return false
      }
    },
    [push, onSuccess],
  )
}
