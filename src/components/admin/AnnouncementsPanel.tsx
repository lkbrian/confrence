import { Bell, Loader2, Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSchedule } from '@/lib/scheduleStore'
import { addAnnouncement } from '@/lib/happening'
import { categoryMeta } from '@/lib/happeningMeta'
import type { Announcement, AnnouncementCategory } from '@/lib/types/happening'
import type { RunAction } from '@/lib/types/ui'
import { fieldClass, labelClass } from '@/lib/adminStyles'
import AdminPanel from './AdminPanel'

type AnnouncementsPanelProps = { announcements: Announcement[]; run: RunAction; onDelete: (a: Announcement) => void }

export default function AnnouncementsPanel({ announcements, run, onDelete }: AnnouncementsPanelProps) {
  const schedule = useSchedule()
  const [category, setCategory] = useState<AnnouncementCategory>('general')
  const [day, setDay] = useState('all')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [titleError, setTitleError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('Give the announcement a title.')
      return
    }
    setSaving(true)
    const ok = await run(
      () => addAnnouncement({ category, day: day === 'all' ? null : Number(day), title: title.trim(), body: body.trim() }),
      'Announcement added.',
    )
    setSaving(false)
    if (ok) {
      setTitle('')
      setBody('')
    }
  }

  return (
    <AdminPanel title="Announcements" description="Transport, meals, venue changes and more." icon={<Bell size={16} />}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={labelClass}>Category</span>
            <Select value={category} onValueChange={(v) => setCategory(v as AnnouncementCategory)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(categoryMeta).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className={labelClass}>Show on</span>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All days</SelectItem>
                {schedule.map((d, i) => (
                  <SelectItem key={d.isoDate} value={String(i + 1)}>{d.day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label htmlFor="ann-title" className={labelClass}>Title</label>
          <Input
            id="ann-title"
            value={title}
            placeholder="e.g. Afternoon workshop moved to Hall B"
            onChange={(e) => {
              setTitle(e.target.value)
              setTitleError('')
            }}
            aria-invalid={Boolean(titleError)}
            className={titleError ? 'border-brand-red' : ''}
          />
          {titleError && <p className="mt-1.5 pl-4 text-xs font-medium text-brand-red">{titleError}</p>}
        </div>
        <div>
          <label htmlFor="ann-body" className={labelClass}>Details</label>
          <textarea id="ann-body" rows={2} value={body} onChange={(e) => setBody(e.target.value)} className={fieldClass} />
        </div>
        <Button type="submit" disabled={saving} className="bg-brand-dark hover:bg-brand-green">
          {saving ? <Loader2 className="animate-spin" /> : <Plus />} Add announcement
        </Button>
      </form>

      {announcements.length > 0 && (
        <ul className="mt-6 space-y-2 border-t border-stone-100 pt-5">
          {announcements.map((a) => {
            const { icon: Icon, label } = categoryMeta[a.category] ?? categoryMeta.general
            return (
              <li key={a.id} className="flex items-center gap-3 rounded-xl bg-stone-50 p-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-brand-red"><Icon size={15} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-stone-500">{label} · {a.day ? `Day ${a.day}` : 'All days'}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onDelete(a)} aria-label={`Delete ${a.title}`} className="text-stone-500 hover:text-brand-red">
                  <Trash2 />
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </AdminPanel>
  )
}
