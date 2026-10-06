import { Loader2, Megaphone, Send, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addUpdate } from '@/lib/happening'
import { updateKindMeta } from '@/lib/happeningMeta'
import { formatTimeOfDay } from '@/lib/timeline'
import type { LiveUpdate, UpdateKind } from '@/lib/types/happening'
import type { RunAction } from '@/lib/types/ui'
import { fieldClass, labelClass } from '@/lib/adminStyles'
import AdminPanel from './AdminPanel'
import PhotoPicker, { EmptyPhotoHint, PhotoThumb } from './PhotoPicker'

type UpdateComposerProps = {
  day: number
  updates: LiveUpdate[]
  run: RunAction
  onDelete: (update: LiveUpdate) => void
}

export default function UpdateComposer({ day, updates, run, onDelete }: UpdateComposerProps) {
  const [kind, setKind] = useState<UpdateKind>('general')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [titleError, setTitleError] = useState('')
  const [publishing, setPublishing] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('Give the update a title.')
      return
    }
    setPublishing(true)
    const ok = await run(() => addUpdate({ day, kind: image && kind === 'general' ? 'photo' : kind, title: title.trim(), body: body.trim(), image_url: image }), 'Update published.')
    setPublishing(false)
    if (ok) {
      setTitle('')
      setBody('')
      setImage(null)
      setKind('general')
    }
  }

  return (
    <AdminPanel title="Post an update" description={`Appears instantly in the Day ${day} feed.`} icon={<Megaphone size={16} />}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <div>
            <span className={labelClass}>Type</span>
            <Select value={kind} onValueChange={(v) => setKind(v as UpdateKind)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(updateKindMeta).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="update-title" className={labelClass}>Title</label>
            <Input
              id="update-title"
              value={title}
              placeholder="e.g. Morning session underway"
              onChange={(e) => {
                setTitle(e.target.value)
                setTitleError('')
              }}
              aria-invalid={Boolean(titleError)}
              className={titleError ? 'border-brand-red' : ''}
            />
            {titleError && <p className="mt-1.5 pl-4 text-xs font-medium text-brand-red">{titleError}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="update-body" className={labelClass}>Details</label>
          <textarea id="update-body" rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What's happening?" className={fieldClass} />
        </div>
        <div>
          <span className={labelClass}>Photo</span>
          {image ? <PhotoThumb src={image} onRemove={() => setImage(null)} /> : <><PhotoPicker day={day} onPick={setImage} run={run} /><EmptyPhotoHint /></>}
        </div>
        <Button type="submit" disabled={publishing} className="bg-brand-red hover:bg-brand-dark">
          {publishing ? <Loader2 className="animate-spin" /> : <Send />} {publishing ? 'Publishing…' : 'Publish update'}
        </Button>
      </form>

      <div className="mt-6 border-t border-stone-100 pt-5">
        <p className="mb-3 text-sm font-semibold text-stone-800">Posted on Day {day} ({updates.length})</p>
        {updates.length === 0 ? (
          <p className="text-sm text-stone-500">Nothing posted yet.</p>
        ) : (
          <ul className="space-y-2">
            {updates.map((u) => (
              <li key={u.id} className="flex items-center gap-3 rounded-xl bg-stone-50 p-2.5">
                {u.image_url ? <img src={u.image_url} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" /> : <span className="h-11 w-11 shrink-0 rounded-lg bg-brand-cream" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{u.title}</p>
                  <p className="text-xs text-stone-500">{formatTimeOfDay(u.created_at)} · {updateKindMeta[u.kind]?.label ?? u.kind}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onDelete(u)} aria-label={`Delete ${u.title}`} className="text-stone-500 hover:text-brand-red">
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminPanel>
  )
}
