import { useSyncExternalStore } from 'react'
import { schedule as fallbackSchedule } from '../data'
import { supabase } from './supabase'
import type { ScheduleDay } from './types/data'

/** A row of public.schedules (see supabase/schedules.sql). */
export type ScheduleRow = {
  id: string
  day: number
  day_label: string
  date_label: string
  iso_date: string
  position: number
  start_time: string // 'HH:MM:SS'
  end_time: string
  activity: string
  facilitator: string | null
}

// Starts as the programme in data.ts, then switches to the schedules table once it loads.
// If the table is missing, empty or unreachable, the site keeps using data.ts.
let current: ScheduleDay[] = fallbackSchedule
let started = false
const listeners = new Set<() => void>()

const hhmm = (time: string) => time.slice(0, 5).replace(':', '')

export function rowsToSchedule(rows: ScheduleRow[]): ScheduleDay[] {
  const byDay = new Map<number, ScheduleRow[]>()
  for (const row of rows) byDay.set(row.day, [...(byDay.get(row.day) ?? []), row])
  return [...byDay.keys()]
    .sort((a, b) => a - b)
    .map((day) => {
      const dayRows = byDay.get(day)!.sort((a, b) => a.start_time.localeCompare(b.start_time) || a.position - b.position)
      return {
        day: dayRows[0].day_label,
        date: dayRows[0].date_label,
        isoDate: dayRows[0].iso_date,
        items: dayRows.map((r) => ({
          id: r.id,
          time: `${hhmm(r.start_time)} - ${hhmm(r.end_time)}`,
          activity: r.activity,
          facilitator: r.facilitator ?? undefined,
        })),
      }
    })
}

export async function fetchScheduleRows() {
  const { data, error } = await supabase.from('schedules').select('*').order('day').order('start_time').order('position')
  if (error) throw new Error(error.message)
  return (data ?? []) as ScheduleRow[]
}

async function load() {
  try {
    const rows = await fetchScheduleRows()
    if (rows.length === 0) return
    current = rowsToSchedule(rows)
    listeners.forEach((listener) => listener())
  } catch {
    // Keep the data.ts programme.
  }
}

function start() {
  if (started) return
  started = true
  load()
  supabase
    .channel('schedules-store')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => load())
    .subscribe()
}

/** Current programme, outside React. Components should use `useSchedule()` so they re-render on changes. */
export function getSchedule() {
  return current
}

export function useSchedule() {
  return useSyncExternalStore(
    (listener) => {
      start()
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => current,
  )
}

/** Re-read the table now (e.g. right after an admin edit). */
export const reloadSchedule = load
