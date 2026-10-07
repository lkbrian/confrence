import { Check, ImagePlus, Images, Loader2, RefreshCw, Trash2, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import folderPhotos from 'virtual:happening-photos'
import { Button } from '@/components/ui/button'
import { AuthExpiredError, deleteBucketPhoto, listBucketPhotos, uploadPhoto } from '@/lib/happening'
import type { RunAction } from '@/lib/types/ui'

type PhotoPickerProps = {
  day: number
  onPick: (url: string) => void
  run: RunAction
  disabled?: boolean
  /** Allow uploading several files at once and keep the library open while picking. */
  multiple?: boolean
  /** Photos already chosen, marked in the library. */
  selected?: string[]
  /** Called after a photo is deleted from the bucket, to drop it from unsaved local state. */
  onDelete?: (url: string) => void
}

type Source = 'bucket' | 'folder'

/** Upload new photos to the bucket, or pick ones already in the bucket or in public/happening. */
export default function PhotoPicker({ day, onPick, run, disabled, multiple, selected = [], onDelete }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null)
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<Source>('bucket')
  const [bucketPhotos, setBucketPhotos] = useState<string[] | null>(null)
  const [bucketError, setBucketError] = useState('')
  const [loadingBucket, setLoadingBucket] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

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

  async function handleFiles(list: FileList | null) {
    const files = Array.from(list ?? [])
    if (files.length === 0) return
    setUploading({ done: 0, total: files.length })
    // One at a time, so each finished photo is picked right away; a bad file is skipped, not fatal.
    const ok = await run(async () => {
      const failed: string[] = []
      for (const [i, file] of files.entries()) {
        try {
          onPick(await uploadPhoto(file, day))
        } catch (err) {
          if (err instanceof AuthExpiredError) throw err
          failed.push(err instanceof Error ? err.message : `${file.name} failed to upload.`)
        }
        setUploading({ done: i + 1, total: files.length })
      }
      if (failed.length > 0) {
        throw new Error(`Uploaded ${files.length - failed.length} of ${files.length}. ${failed.join(' ')}`)
      }
    }, files.length > 1 ? `${files.length} photos uploaded.` : 'Photo uploaded.')
    setUploading(null)
    if (inputRef.current) inputRef.current.value = ''
    // The new upload belongs in the bucket list too.
    if (ok && bucketPhotos !== null) loadBucket()
  }

  async function handleDelete(src: string) {
    setDeleting(src)
    const ok = await run(() => deleteBucketPhoto(src), 'Photo deleted.')
    setDeleting(null)
    setConfirmDelete(null)
    if (!ok) return
    setBucketPhotos((all) => all?.filter((s) => s !== src) ?? all)
    onDelete?.(src)
  }

  const photos = source === 'bucket' ? (bucketPhotos ?? []) : folderPhotos

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <Button type="button" variant="outline" size="sm" disabled={disabled || !!uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}{' '}
          {uploading ? (uploading.total > 1 ? `Uploading ${uploading.done + 1}/${uploading.total}…` : 'Uploading…') : multiple ? 'Upload photos' : 'Upload photo'}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={toggleLibrary}>
          <Images /> {open ? 'Hide photos' : multiple ? 'Choose existing photos' : 'Choose existing photo'}
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
                {photos.map((src) => {
                  const isSelected = selected.includes(src)
                  const canDelete = source === 'bucket'
                  if (canDelete && confirmDelete === src) {
                    return (
                      <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
                        <img src={src} alt="" className="h-full w-full object-cover opacity-40" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
                          <button
                            type="button"
                            disabled={deleting === src}
                            onClick={() => handleDelete(src)}
                            className="w-full rounded-md bg-brand-red px-1 py-1 text-[11px] font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
                          >
                            {deleting === src ? <Loader2 size={12} className="mx-auto animate-spin" /> : 'Delete'}
                          </button>
                          <button
                            type="button"
                            disabled={deleting === src}
                            onClick={() => setConfirmDelete(null)}
                            className="w-full rounded-md bg-white/90 px-1 py-1 text-[11px] font-semibold text-stone-700 transition hover:bg-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div key={src} className="group relative aspect-square">
                      <button
                        type="button"
                        aria-pressed={multiple ? isSelected : undefined}
                        onClick={() => {
                          onPick(src)
                          if (!multiple) setOpen(false)
                        }}
                        className={`h-full w-full overflow-hidden rounded-lg bg-stone-100 ring-brand-red transition hover:ring-2 ${isSelected ? 'ring-2' : ''}`}
                      >
                        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </button>
                      {isSelected && (
                        <span className="pointer-events-none absolute right-1 top-1 rounded-full bg-brand-red p-0.5 text-white">
                          <Check size={12} />
                        </span>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(src)}
                          aria-label="Delete photo from storage"
                          className="absolute bottom-1 left-1 rounded-full bg-black/60 p-1 text-white opacity-100 transition hover:bg-brand-red sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  )
                })}
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
