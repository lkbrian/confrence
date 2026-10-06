import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import type { Toast } from '@/lib/useToast'

export default function Toaster({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            role={toast.tone === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.tone === 'error' ? 'bg-brand-red' : 'bg-brand-dark'}`}
          >
            {toast.tone === 'error' ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-green" />}
            <span className="flex-1">{toast.message}</span>
            <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss" className="opacity-70 transition hover:opacity-100">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
