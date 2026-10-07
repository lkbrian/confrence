import { ImageIcon } from 'lucide-react'

/** Placeholder where photos will go: faint tiles behind a dashed border, with a message on top. */
export function EmptyPhotos({ message, compact = false }: { message: string; compact?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-dashed border-stone-300 bg-white/50 p-2">
      <div className={`grid grid-cols-3 gap-2 ${compact ? '' : 'sm:grid-cols-6'}`} aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-square rounded-sm bg-stone-200/70" />
        ))}
      </div>
      <div className="absolute inset-0 grid place-items-center p-4">
        <p className="flex items-center gap-2 rounded-sm bg-white/95 px-4 py-2.5 text-center text-sm font-medium text-stone-600 shadow-sm">
          <ImageIcon size={16} className="shrink-0 text-stone-400" /> {message}
        </p>
      </div>
    </div>
  )
}
