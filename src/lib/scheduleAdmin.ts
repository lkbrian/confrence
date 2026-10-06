import { check } from './happening'
import { reloadSchedule, type ScheduleRow } from './scheduleStore'
import { supabase } from './supabase'

export type ScheduleEdit = { start_time: string; end_time: string; activity: string; facilitator: string }

export function validateEdit(edit: ScheduleEdit) {
  if (!edit.activity.trim()) return 'Activity is required.'
  if (!edit.start_time || !edit.end_time) return 'Start and end times are required.'
  if (edit.end_time <= edit.start_time) return 'End time must be after the start time.'
  return null
}

function toColumns(edit: ScheduleEdit) {
  return {
    start_time: edit.start_time,
    end_time: edit.end_time,
    activity: edit.activity.trim(),
    facilitator: edit.facilitator.trim() || null,
    updated_at: new Date().toISOString(),
  }
}

export async function updateScheduleRow(id: string, edit: ScheduleEdit) {
  const { error } = await supabase.from('schedules').update(toColumns(edit)).eq('id', id)
  check(error)
  await reloadSchedule()
}

export async function addScheduleRow(dayRows: ScheduleRow[], day: number, edit: ScheduleEdit) {
  const ref = dayRows[0]
  if (!ref) throw new Error('This day has no sessions to copy the date from.')
  const { error } = await supabase.from('schedules').insert({
    id: `d${day}-${crypto.randomUUID().slice(0, 8)}`,
    day,
    day_label: ref.day_label,
    date_label: ref.date_label,
    iso_date: ref.iso_date,
    position: Math.max(...dayRows.map((r) => r.position)) + 1,
    ...toColumns(edit),
  })
  check(error)
  await reloadSchedule()
}

export async function deleteScheduleRow(id: string) {
  const { error } = await supabase.from('schedules').delete().eq('id', id)
  check(error)
  // Its extension (if any) would otherwise linger.
  await supabase.from('event_extensions').delete().eq('event_id', id)
  await reloadSchedule()
}
