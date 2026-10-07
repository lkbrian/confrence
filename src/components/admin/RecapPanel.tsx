import { BookOpenCheck, Loader2, Save } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { saveRecap } from '@/lib/happening'
import type { DayRecap } from '@/lib/types/happening'
import type { RunAction } from '@/lib/types/ui'
import { fieldClass, labelClass } from '@/lib/adminStyles'
import AdminPanel from './AdminPanel'
import PhotoPicker, { PhotoThumb } from './PhotoPicker'

type RecapPanelProps = { day: number; recap?: DayRecap; run: RunAction }

/** Remount with a `key` when the day or saved recap changes to reload its values. */
export default function RecapPanel({ day, recap, run }: RecapPanelProps) {
  const [text, setText] = useState(recap?.text ?? '')
  const [images, setImages] = useState<string[]>(recap?.images ?? [])
  const [saving, setSaving] = useState(false)
  const dirty = text !== (recap?.text ?? '') || images.join() !== (recap?.images ?? []).join()

  async function handleSave() {
    setSaving(true)
    await run(() => saveRecap(day, text.trim(), images), recap ? 'Recap updated.' : 'Recap published.')
    setSaving(false)
  }

  return (
    <AdminPanel title={`Day ${day} recap`} description="Shown at the bottom of the live page once published." icon={<BookOpenCheck size={16} />}>
      <div className="space-y-4">
        <div>
          <label htmlFor="recap-text" className={labelClass}>Summary</label>
          <textarea id="recap-text" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="What a powerful opening day…" className={fieldClass} />
        </div>
        <div>
          <span className={labelClass}>Photos ({images.length})</span>
          {images.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {images.map((src) => (
                <PhotoThumb key={src} src={src} onRemove={() => setImages((all) => all.filter((s) => s !== src))} />
              ))}
            </div>
          )}
          <PhotoPicker
            day={day}
            run={run}
            multiple
            selected={images}
            onPick={(src) => setImages((all) => (all.includes(src) ? all : [...all, src]))}
            onDelete={(src) => setImages((all) => all.filter((s) => s !== src))}
          />
        </div>
        <Button onClick={handleSave} disabled={saving || !dirty || (!text.trim() && images.length === 0)} className="bg-brand-dark hover:bg-brand-green">
          {saving ? <Loader2 className="animate-spin" /> : <Save />} {recap ? 'Save recap' : 'Publish recap'}
        </Button>
        {dirty && <p className="text-xs text-stone-500">You have unsaved changes.</p>}
      </div>
    </AdminPanel>
  )
}
