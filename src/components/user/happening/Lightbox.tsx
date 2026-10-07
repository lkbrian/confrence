import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect } from 'react'

type LightboxProps = { photos: string[]; index: number | null; onChange: (index: number | null) => void }

export default function Lightbox({ photos, index, onChange }: LightboxProps) {
  const open = index !== null && photos[index] !== undefined

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange((index! + 1) % photos.length)
      if (e.key === 'ArrowLeft') onChange((index! - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, photos.length, onChange])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onChange(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <img src={photos[index!]} alt="" className="max-h-full max-w-full rounded-xs object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" aria-label="Close" onClick={() => onChange(null)} className="absolute right-4 top-4 rounded-sm bg-white/10 p-2 text-white transition hover:bg-white/20">
            <X size={22} />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange((index! - 1 + photos.length) % photos.length)
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm bg-white/10 p-2 text-white transition hover:bg-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange((index! + 1) % photos.length)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm bg-white/10 p-2 text-white transition hover:bg-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
