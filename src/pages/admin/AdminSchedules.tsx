import { AlertCircle, CalendarClock, Loader2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import AdminPanel from '@/components/admin/AdminPanel'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import Toaster from '@/components/admin/Toaster'
import { Button } from '@/components/ui/button'
import { addScheduleRow, deleteScheduleRow, updateScheduleRow, validateEdit, type ScheduleEdit } from '@/lib/scheduleAdmin'
import { fetchScheduleRows, type ScheduleRow } from '@/lib/scheduleStore'
import { supabase } from '@/lib/supabase'
import { readClock, todayIndex } from '@/lib/timeline'
import type { RunAction } from '@/lib/types/ui'
import { useAdminRun } from '@/lib/useAdminRun'
import { useToast } from '@/lib/useToast'

const cellInput =
  'h-9 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:opacity-50'

const toEdit = (r: ScheduleRow): ScheduleEdit => ({
  start_time: r.start_time.slice(0, 5),
  end_time: r.end_time.slice(0, 5),
  activity: r.activity,
  facilitator: r.facilitator ?? '',
})

const EMPTY_EDIT: ScheduleEdit = { start_time: '', end_time: '', activity: '', facilitator: '' }

/** One editable session. Remounted via `key` when the saved row changes. */
function SessionRow({ row, run, onDelete }: { row: ScheduleRow; run: RunAction; onDelete: (row: ScheduleRow) => void }) {
  const saved = toEdit(row)
  const [edit, setEdit] = useState(saved)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const dirty = (Object.keys(saved) as (keyof ScheduleEdit)[]).some((k) => edit[k] !== saved[k])

  function set<K extends keyof ScheduleEdit>(key: K, value: string) {
    setEdit((e) => ({ ...e, [key]: value }))
    setError('')
  }

  async function save() {
    const problem = validateEdit(edit)
    if (problem) return setError(problem)
    setSaving(true)
    await run(() => updateScheduleRow(row.id, edit), `"${edit.activity.trim()}" saved.`)
    setSaving(false)
  }

  return (
    <li className={`rounded-xl border p-3 transition ${dirty ? 'border-brand-green/60 bg-brand-green/5' : 'border-stone-200 bg-white'}`}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-[6.5rem_6.5rem_1fr_1fr_auto] sm:items-center">
        <label className="text-xs font-semibold text-stone-500 sm:sr-only" htmlFor={`${row.id}-start`}>Start</label>
        <label className="text-xs font-semibold text-stone-500 sm:hidden" htmlFor={`${row.id}-end`}>End</label>
        <input id={`${row.id}-start`} type="time" value={edit.start_time} onChange={(e) => set('start_time', e.target.value)} className={`${cellInput} -mt-1 sm:mt-0`} aria-label="Start time" />
        <input id={`${row.id}-end`} type="time" value={edit.end_time} onChange={(e) => set('end_time', e.target.value)} className={`${cellInput} -mt-1 sm:mt-0`} aria-label="End time" />
        <input value={edit.activity} onChange={(e) => set('activity', e.target.value)} placeholder="Activity" aria-label="Activity" className={`${cellInput} col-span-2 sm:col-span-1`} />
        <input value={edit.facilitator} onChange={(e) => set('facilitator', e.target.value)} placeholder="Facilitator (optional)" aria-label="Facilitator" className={`${cellInput} col-span-2 sm:col-span-1`} />
        <div className="col-span-2 flex justify-end gap-1 sm:col-span-1">
          {dirty && (
            <Button variant="ghost" size="sm" onClick={() => { setEdit(saved); setError('') }} aria-label="Undo changes" disabled={saving}>
              <RotateCcw />
            </Button>
          )}
          <Button size="sm" onClick={save} disabled={!dirty || saving} className="bg-brand-dark hover:bg-brand-green">
            {saving ? <Loader2 className="animate-spin" /> : <Save />} Save
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row)} aria-label={`Delete ${row.activity}`} className="text-stone-500 hover:text-brand-red" disabled={saving}>
            <Trash2 />
          </Button>
        </div>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-brand-red">{error}</p>}
    </li>
  )
}

function AddSession({ dayRows, day, run }: { dayRows: ScheduleRow[]; day: number; run: RunAction }) {
  const [edit, setEdit] = useState(EMPTY_EDIT)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function add() {
    const problem = validateEdit(edit)
    if (problem) return setError(problem)
    setSaving(true)
    const ok = await run(() => addScheduleRow(dayRows, day, edit), `"${edit.activity.trim()}" added to Day ${day}.`)
    setSaving(false)
    if (ok) setEdit(EMPTY_EDIT)
  }

  return (
    <div className="mt-4 rounded-xl border border-dashed border-stone-300 p-3">
      <p className="mb-2 text-sm font-semibold text-stone-800">Add a session</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-[6.5rem_6.5rem_1fr_1fr_auto]">
        <input type="time" value={edit.start_time} onChange={(e) => { setEdit({ ...edit, start_time: e.target.value }); setError('') }} className={cellInput} aria-label="Start time" />
        <input type="time" value={edit.end_time} onChange={(e) => { setEdit({ ...edit, end_time: e.target.value }); setError('') }} className={cellInput} aria-label="End time" />
        <input value={edit.activity} onChange={(e) => { setEdit({ ...edit, activity: e.target.value }); setError('') }} placeholder="Activity" aria-label="Activity" className={`${cellInput} col-span-2 sm:col-span-1`} />
        <input value={edit.facilitator} onChange={(e) => setEdit({ ...edit, facilitator: e.target.value })} placeholder="Facilitator (optional)" aria-label="Facilitator" className={`${cellInput} col-span-2 sm:col-span-1`} />
        <Button size="sm" onClick={add} disabled={saving} className="col-span-2 bg-brand-red hover:bg-brand-dark sm:col-span-1">
          {saving ? <Loader2 className="animate-spin" /> : <Plus />} Add
        </Button>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-brand-red">{error}</p>}
    </div>
  )
}

export default function AdminSchedules() {
  const [rows, setRows] = useState<ScheduleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [day, setDay] = useState(() => todayIndex(readClock()) + 1)
  const [pendingDelete, setPendingDelete] = useState<ScheduleRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toasts, push, dismiss } = useToast()

  const refresh = useCallback(
    () =>
      fetchScheduleRows()
        .then((data) => {
          setRows(data)
          setLoadError('')
        })
        .catch((err: Error) => setLoadError(err.message))
        .finally(() => setLoading(false)),
    [],
  )

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel(`admin-schedules-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => refresh())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refresh])

  const run = useAdminRun(push, refresh)
  const days = [...new Set(rows.map((r) => r.day))].sort((a, b) => a - b)
  const dayRows = rows.filter((r) => r.day === day)

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    const ok = await run(() => deleteScheduleRow(pendingDelete.id), `"${pendingDelete.activity}" removed.`)
    setDeleting(false)
    if (ok) setPendingDelete(null)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">Programme</p>
      <h1 className="mt-1 text-2xl font-extrabold text-stone-950 sm:text-3xl">Schedules</h1>
      <p className="mt-1 text-sm text-stone-600">Edits go live on the home page and the live page straight away. To run a session over time on the day, use <strong>Happening Now → Extend</strong> instead.</p>

      {loadError && (
        <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-brand-red/25 bg-white px-4 py-3 text-sm text-brand-red">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>Couldn't load the schedule: {loadError}. Run <code>supabase/schedules.sql</code> in Supabase; until then the site uses the built-in programme.</span>
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center py-20 text-stone-500"><Loader2 className="animate-spin" size={28} aria-label="Loading" /></div>
      ) : (
        !loadError && (
          <>
            <div role="tablist" aria-label="Day" className="mt-5 flex gap-2 overflow-x-auto">
              {days.map((d) => (
                <button
                  key={d}
                  role="tab"
                  aria-selected={d === day}
                  onClick={() => setDay(d)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${d === day ? 'bg-brand-red text-white' : 'border border-stone-300 bg-white hover:border-brand-red'}`}
                >
                  Day {d}
                  <span className="ml-1.5 hidden font-normal opacity-80 sm:inline">· {rows.find((r) => r.day === d)?.date_label.split(',')[0]}</span>
                </button>
              ))}
            </div>

            <AdminPanel
              className="mt-5"
              title={`Day ${day}`}
              description={dayRows[0] ? `${dayRows[0].date_label} · ${dayRows.length} sessions` : 'No sessions'}
              icon={<CalendarClock size={16} />}
            >
              <div className="mb-2 hidden grid-cols-[6.5rem_6.5rem_1fr_1fr_auto] gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-stone-400 sm:grid">
                <span>Start</span><span>End</span><span>Activity</span><span>Facilitator</span><span className="w-40" />
              </div>
              <ol className="space-y-2">
                {dayRows.map((row) => (
                  <SessionRow key={`${row.id}-${row.start_time}-${row.end_time}-${row.activity}-${row.facilitator}`} row={row} run={run} onDelete={setPendingDelete} />
                ))}
              </ol>
              <AddSession dayRows={dayRows} day={day} run={run} />
            </AdminPanel>
          </>
        )
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this session?"
        confirmLabel="Delete"
        tone="danger"
        busy={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      >
        {pendingDelete && <>"{pendingDelete.activity}" ({pendingDelete.start_time.slice(0, 5)}–{pendingDelete.end_time.slice(0, 5)}) will be removed from Day {pendingDelete.day}.</>}
      </ConfirmDialog>

      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
