import { ImagePlus, Images, Loader2, RefreshCw, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import folderPhotos from 'virtual:happening-photos'
import { Button } from '@/components/ui/button'
import { listBucketPhotos, uploadPhoto } from '@/lib/happening'
import type { RunAction } from '@/lib/types/ui'

type PhotoPickerProps = {
  day: number
  onPick: (url: string) => void
  run: RunAction
  disabled?: boolean
}

type Source = 'bucket' | 'folder'

/** Upload a new photo to the bucket, or pick one already in the bucket or in public/happening. */
export default function PhotoPicker({ day, onPick, run, disabled }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<Source>('bucket')
  const [bucketPhotos, setBucketPhotos] = useState<string[] | null>(null)
  const [bucketError, setBucketError] = useState('')
  const [loadingBucket, setLoadingBucket] = useState(false)

  const loadBucket = useCallback(async () => {
    setLoadingBucket(true)
    setBucketError('')
    try {
      setBucketPhotos(await listBucketPhotos())
    } catch (err) {
      setBucketError(err instanceof Error ? err.message : 'Could not load the bucket.')
    } finally {
      setLoadingBucket(false)
    }
  }, [])

  function toggleLibrary() {
    const next = !open
    setOpen(next)
    if (next && bucketPhotos === null) loadBucket()
  }

  async function handleFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    const ok = await run(async () => onPick(await uploadPhoto(file, day)), 'Photo uploaded.')
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
    // The new upload belongs in the bucket list too.
    if (ok && bucketPhotos !== null) loadBucket()
  }

  const photos = source === 'bucket' ? (bucketPhotos ?? []) : folderPhotos

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <Button type="button" variant="outline" size="sm" disabled={disabled || uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />} {uploading ? 'Uploading…' : 'Upload photo'}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={toggleLibrary}>
          <Images /> {open ? 'Hide photos' : 'Choose existing photo'}
        </Button>
      </div>

      {open && (
        <div className="mt-3 rounded-xl border border-stone-200">
          <div className="flex items-center justify-between gap-2 border-b border-stone-100 px-2 py-1.5">
            <div role="tablist" className="flex gap-1">
              {(
                [
                  ['bucket', `Bucket${bucketPhotos ? ` (${bucketPhotos.length})` : ''}`],
                  ['folder', `/happening folder (${folderPhotos.length})`],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={source === value}
                  onClick={() => setSource(value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${source === value ? 'bg-brand-dark text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {source === 'bucket' && (
              <button type="button" onClick={loadBucket} disabled={loadingBucket} aria-label="Refresh bucket photos" className="rounded-full p-1.5 text-stone-500 transition hover:bg-stone-100 disabled:opacity-50">
                <RefreshCw size={14} className={loadingBucket ? 'animate-spin' : undefined} />
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5">
            {source === 'bucket' && loadingBucket && bucketPhotos === null ? (
              <div className="grid place-items-center py-8 text-stone-400"><Loader2 className="animate-spin" size={20} /></div>
            ) : source === 'bucket' && bucketError ? (
              <p className="px-2 py-6 text-center text-sm text-brand-red">{bucketError}</p>
            ) : photos.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-stone-500">
                {source === 'bucket' ? 'No photos in the bucket yet. Upload one above.' : 'No photos yet. Add images to public/happening in the project.'}
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                {photos.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => {
                      onPick(src)
                      setOpen(false)
                    }}
                    className="aspect-square overflow-hidden rounded-lg bg-stone-100 ring-brand-red transition hover:ring-2"
                  >
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function PhotoThumb({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-stone-100">
      <img src={src} alt="" className="h-full w-full object-cover" />
      <button type="button" onClick={onRemove} aria-label="Remove photo" className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-brand-red">
        <X size={12} />
      </button>
    </div>
  )
}

export function EmptyPhotoHint() {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
      <ImagePlus size={13} /> Optional. Uploads are resized and saved to the bucket.
    </p>
  )
}
