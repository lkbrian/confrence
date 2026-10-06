import { useEffect, useState } from 'react'
import { reloadSchedule } from './scheduleStore'
import { getLiveStatus, type ConferenceClock } from './timeline'
import type { Extensions } from './types/happening'

/**
 * Live status that never moves on to the next session on stale data.
 *
 * When the shown session's end time (or the next session's start) arrives, the status is held on
 * the last minute before that boundary while the schedule and extensions are re-fetched. Only then
 * is it released: if the session was extended in the meantime it stays "happening now", otherwise
 * the next session takes over. Realtime normally delivers extensions instantly; this covers the
 * case where a device missed that push (sleeping phone, dropped connection).
 */
export function useLiveStatus(clock: ConferenceClock, extensions: Extensions, refresh: () => Promise<unknown>, upcomingCount = 5) {
  const [hold, setHold] = useState<number | null>(null)
  const effective = hold === null ? clock : { ...clock, minutes: Math.min(clock.minutes, hold) }
  const status = getLiveStatus(effective, extensions, upcomingCount)
  const boundary = status.isConferenceDay ? (status.current?.end ?? status.upcoming[0]?.start) : undefined
  const isPreview = new URLSearchParams(window.location.search).has('now')

  useEffect(() => {
    if (hold !== null || boundary === undefined || isPreview) return
    const secondsIntoMinute = new Date().getSeconds()
    const delay = Math.max(0, ((boundary - clock.minutes) * 60 - secondsIntoMinute) * 1000)
    const id = window.setTimeout(() => {
      setHold(boundary - 1)
      Promise.allSettled([refresh(), reloadSchedule()]).finally(() => setHold(null))
    }, delay)
    return () => window.clearTimeout(id)
  }, [boundary, clock.minutes, hold, isPreview, refresh])

  return status
}
