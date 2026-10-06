import { ImageIcon } from 'lucide-react'

type PhotoGridProps = { title: string; photos: string[]; onOpen: (src: string) => void; emptyMessage: string }

/** The day's gallery (update and recap photos) as a full-width masonry: photos keep their own shape. */
export default function PhotoGrid({ title, photos, onOpen, emptyMessage }: PhotoGridProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">Gallery</p>
          <h2 className="mt-1 text-xl font-extrabold text-stone-950">{title}</h2>
        </div>
        {photos.length > 0 && <p className="text-sm text-stone-500">{photos.length} photo{photos.length === 1 ? '' : 's'}</p>}
      </div>
      {photos.length === 0 ? (
        <EmptyPhotos message={emptyMessage} />
      ) : (
        <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4 2xl:columns-5">
        {photos.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => onOpen(src)}
            className="mb-2 block w-full break-inside-avoid overflow-hidden rounded-sm bg-stone-200 sm:mb-3"
          >
            <img src={src} alt="" loading="lazy" className="block h-auto w-full transition duration-300 hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      )}
    </section>
  )
}

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
