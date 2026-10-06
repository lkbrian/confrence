import { Award, BookOpen, Coffee, Mic2, Music2, Users2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSchedule } from './scheduleStore'
import type { Extensions, LiveEvent, LiveStatus } from './types/happening'

export const CONFERENCE_TZ = 'Africa/Nairobi'

export function iconFor(activity: string) {
  if (/registration|hymn/i.test(activity)) return Music2
  if (/testimonial|closing|resolution|certification/i.test(activity)) return Award
  if (/panel/i.test(activity)) return Users2
  if (/tea break|lunch|break away/i.test(activity)) return Coffee
  if (/devotion|pastoral charge/i.test(activity)) return BookOpen
  return Mic2
}

/** '0730 - 0830' → [450, 510] (minutes since midnight). */
export function parseRange(range: string): [number, number] {
  const [from, to] = range.split('-').map((part) => part.trim())
  const toMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(2, 4))
  return [toMinutes(from), toMinutes(to)]
}

/** 450 → '07:30' */
export function fmt(minutes: number) {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function eventId(dayIndex: number, index: number) {
  return `d${dayIndex + 1}-${index}`
}

/**
 * Applies extensions as a cascade: extending a session pushes back
 * every later session on the same day by the same amount.
 */
export function buildDay(dayIndex: number, extensions: Extensions, days = getSchedule()): LiveEvent[] {
  let shift = 0
  return days[dayIndex].items.map((item, index) => {
    const id = item.id ?? eventId(dayIndex, index)
    const [baseStart, baseEnd] = parseRange(item.time)
    const extendedBy = extensions[id] ?? 0
    const start = baseStart + shift
    shift += extendedBy
    return {
      id,
      dayIndex,
      index,
      activity: item.activity,
      facilitator: item.facilitator,
      baseStart,
      baseEnd,
      start,
      end: baseEnd + shift,
      extendedBy,
      shiftedBy: start - baseStart,
    }
  })
}

export type ConferenceClock = { isoDate: string; minutes: number }

export function nairobiClock(date = new Date()): ConferenceClock {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: CONFERENCE_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  return { isoDate: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) }
}

/** Real Nairobi time, or `?now=2026-10-07T10:20` to preview any moment. */
export function readClock(): ConferenceClock {
  const override = new URLSearchParams(window.location.search).get('now')
  const match = override && /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/.exec(override)
  if (match) return { isoDate: match[1], minutes: Number(match[2]) * 60 + Number(match[3]) }
  return nairobiClock()
}

export function useClock(intervalMs = 30_000) {
  const [clock, setClock] = useState(readClock)
  useEffect(() => {
    const id = window.setInterval(() => setClock(readClock()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return clock
}

export function todayIndex(clock: ConferenceClock) {
  const schedule = getSchedule()
  const idx = schedule.findIndex((day) => day.isoDate === clock.isoDate)
  if (idx !== -1) return idx
  return clock.isoDate < schedule[0].isoDate ? 0 : schedule.length - 1
}

export function getLiveStatus(clock: ConferenceClock, extensions: Extensions, upcomingCount = 4): LiveStatus {
  const schedule = getSchedule()
  const dayIndex = todayIndex(clock)
  const isConferenceDay = schedule[dayIndex].isoDate === clock.isoDate
  const events = buildDay(dayIndex, extensions)

  if (!isConferenceDay) {
    const before = clock.isoDate < schedule[0].isoDate
    return {
      phase: before ? 'before' : 'after',
      dayIndex,
      isConferenceDay,
      upcoming: before ? events.slice(0, upcomingCount) : [],
    }
  }

  const now = clock.minutes
  const current = events.find((e) => e.start <= now && now < e.end)
  const upcoming = events.filter((e) => e.start > now && e !== current).slice(0, upcomingCount)
  const phase = current ? 'live' : now < events[0].start ? 'before' : now >= events[events.length - 1].end ? 'after' : 'between'

  return { phase, dayIndex, isConferenceDay, current, upcoming }
}

/** Minutes until a session starts, as a short human label. */
export function startsIn(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function formatTimeOfDay(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: CONFERENCE_TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
