import { useCallback, useState } from 'react'

export type Toast = { id: number; tone: 'success' | 'error'; message: string }

let nextId = 1

export function useToast(duration = 4000) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), [])

  const push = useCallback(
    (tone: Toast['tone'], message: string) => {
      const id = nextId++
      setToasts((all) => [...all, { id, tone, message }])
      window.setTimeout(() => dismiss(id), duration)
    },
    [dismiss, duration],
  )

  return { toasts, push, dismiss }
}
