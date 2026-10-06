import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  children?: ReactNode
  confirmLabel?: string
  busy?: boolean
  tone?: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title, children, confirmLabel = 'Confirm', busy, tone = 'default', onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, busy, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50" onClick={() => !busy && onCancel()} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ scale: 0.96, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 id="confirm-title" className="text-lg font-bold text-stone-900">{title}</h2>
            {children && <div className="mt-2 text-sm leading-6 text-stone-600">{children}</div>}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={onCancel} disabled={busy}>Cancel</Button>
              <Button onClick={onConfirm} disabled={busy} className={tone === 'danger' ? 'bg-brand-red hover:bg-brand-dark' : 'bg-brand-dark hover:bg-brand-green'} autoFocus>
                {busy && <Loader2 className="animate-spin" />}
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
