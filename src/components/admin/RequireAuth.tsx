import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '@/lib/auth'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading, endReason } = useSession()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-stone-500">
        <Loader2 className="animate-spin" size={28} aria-label="Checking your session" />
      </div>
    )
  }

  if (!session) {
    const reason = endReason ?? 'auth'
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/admin/login?next=${next}&reason=${reason}`} replace />
  }

  return <>{children}</>
}
