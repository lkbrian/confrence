import { AlertCircle, ExternalLink, Loader2, Timer, TimerOff, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminPanel from '@/components/admin/AdminPanel'
import AnnouncementsPanel from '@/components/admin/AnnouncementsPanel'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import LiveControl from '@/components/admin/LiveControl'
import RecapPanel from '@/components/admin/RecapPanel'
import TimelinePanel from '@/components/admin/TimelinePanel'
import Toaster from '@/components/admin/Toaster'
import UpdateComposer from '@/components/admin/UpdateComposer'
import { Button } from '@/components/ui/button'
import DayTabs from '@/components/user/happening/DayTabs'
import { QUICK_MINUTES } from '@/lib/adminStyles'
import { adjustEvent, deleteAnnouncement, deleteUpdate, resetAll, resetExtension, useHappening } from '@/lib/happening'
import { useSchedule } from '@/lib/scheduleStore'
import { buildDay, fmt, isLiveAt, maxReduction, signed, startsIn, useClock } from '@/lib/timeline'
import { useLiveStatus } from '@/lib/useLiveStatus'
import type { LiveEvent } from '@/lib/types/happening'
import { useAdminRun } from '@/lib/useAdminRun'
import { useToast } from '@/lib/useToast'

type PendingConfirm = { title: string; body: string; label: string; tone?: 'default' | 'danger'; action: () => Promise<unknown>; success: string }

export default function AdminHappening() {
  const clock = useClock(5_000)
  const schedule = useSchedule()
  const { data, loading, error, refresh } = useHappening()
  const { toasts, push, dismiss } = useToast()
  const status = useLiveStatus(clock, data.extensions, refresh)
  const [selected, setSelected] = useState<number | null>(null)
  const dayIndex = selected ?? status.dayIndex
  const day = dayIndex + 1
  const events = useMemo(() => buildDay(dayIndex, data.extensions, schedule), [dayIndex, data.extensions, schedule])

  // Positive minutes extend the session, negative minutes shorten it.
  const [adjust, setAdjust] = useState<{ event: LiveEvent; minutes: number } | null>(null)
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null)
  const [busy, setBusy] = useState(false)

  const run = useAdminRun(push, refresh)

  async function confirmAdjust() {
    if (!adjust || adjust.minutes === 0) return
    setBusy(true)
    const { event, minutes } = adjust
    const verb = minutes > 0 ? 'extended' : 'shortened'
    const ok = await run(() => adjustEvent(event, minutes, nowFor(event)), `${event.activity} ${verb} by ${Math.abs(minutes)} min. Now ends at ${fmt(event.end + minutes)}.`)
    setBusy(false)
    if (ok) setAdjust(null)
  }

  async function confirmAction() {
    if (!confirm) return
    setBusy(true)
    const ok = await run(confirm.action, confirm.success)
    setBusy(false)
    if (ok) setConfirm(null)
  }

  const adjustEvents = adjust ? buildDay(adjust.event.dayIndex, data.extensions) : []
  const laterCount = adjust ? adjustEvents.length - adjust.event.index - 1 : 0
  const shortening = Boolean(adjust && adjust.minutes < 0)

  // The current time, but only for a session running live today: shortening then can't end it in the past.
  function nowFor(event: LiveEvent) {
    return status.isConferenceDay && event.dayIndex === status.dayIndex && isLiveAt(event, clock.minutes) ? clock.minutes : undefined
  }
  const adjustNow = adjust ? nowFor(adjust.event) : undefined

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">Conference hub</p>
          <h1 className="mt-1 text-2xl font-extrabold text-stone-950 sm:text-3xl">Manage live page</h1>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={`/happening?day=${day}`} target="_blank"><ExternalLink /> Preview Day {day}</Link>
        </Button>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex items-start gap-2 rounded-xl border border-brand-red/25 bg-white px-4 py-3 text-sm text-brand-red">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>Couldn't load live data: {error}. Check that <code>supabase/happening.sql</code> has been run.</span>
        </div>
      )}

      <div className="mb-6">
        <DayTabs selected={dayIndex} today={status.isConferenceDay ? status.dayIndex : null} onSelect={setSelected} />
      </div>

      {loading ? (
        <div className="grid place-items-center py-20 text-stone-500"><Loader2 className="animate-spin" size={28} aria-label="Loading" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="space-y-6">
            <LiveControl status={status} clock={clock} onAdjust={(event, minutes) => setAdjust({ event, minutes })} />
            <TimelinePanel
              dayIndex={dayIndex}
              events={events}
              currentId={status.isConferenceDay && dayIndex === status.dayIndex ? status.current?.id : undefined}
              now={status.isConferenceDay && dayIndex === status.dayIndex ? clock.minutes : undefined}
              onExtend={(event) => setAdjust({ event, minutes: 15 })}
              onShorten={(event) => setAdjust({ event, minutes: -Math.min(15, maxReduction(event, nowFor(event))) })}
              onReset={(event) =>
                setConfirm({
                  title: `Remove the ${signed(event.extendedBy)} min change?`,
                  body: `${event.activity} will end at ${fmt(event.end - event.extendedBy)} and later sessions move ${event.extendedBy > 0 ? 'forward' : 'back'} by ${Math.abs(event.extendedBy)} min.`,
                  label: 'Restore original time',
                  action: () => resetExtension(event.id),
                  success: 'Original time restored. Times updated.',
                })
              }
            />
          </div>
          <div className="space-y-6">
            <UpdateComposer
              day={day}
              updates={data.updates.filter((u) => u.day === day)}
              run={run}
              onDelete={(u) =>
                setConfirm({ title: 'Delete this update?', body: `"${u.title}" will be removed from the live page.`, label: 'Delete', tone: 'danger', action: () => deleteUpdate(u.id), success: 'Update deleted.' })
              }
            />
            <AnnouncementsPanel
              announcements={data.announcements}
              run={run}
              onDelete={(a) =>
                setConfirm({ title: 'Delete this announcement?', body: `"${a.title}" will be removed from the live page.`, label: 'Delete', tone: 'danger', action: () => deleteAnnouncement(a.id), success: 'Announcement deleted.' })
              }
            />
            <RecapPanel key={`${day}-${data.recaps[day]?.updated_at ?? 'new'}`} day={day} recap={data.recaps[day]} run={run} />
            <AdminPanel title="Danger zone" icon={<TriangleAlert size={16} />} className="border-brand-red/30">
              <p className="text-sm text-stone-600">Remove every extension, update, announcement and recap. The printed programme is restored.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-brand-red/40 text-brand-red hover:bg-brand-red hover:text-white"
                onClick={() =>
                  setConfirm({
                    title: 'Reset all live data?',
                    body: 'This permanently deletes all extensions, updates, announcements and recaps for all three days. It cannot be undone.',
                    label: 'Reset everything',
                    tone: 'danger',
                    action: resetAll,
                    success: 'All live data reset.',
                  })
                }
              >
                Reset all live data
              </Button>
            </AdminPanel>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(adjust)}
        title={adjust ? `${shortening ? 'Shorten' : 'Extend'} "${adjust.event.activity}"?` : ''}
        confirmLabel={adjust ? `${shortening ? 'Shorten' : 'Extend'} ${signed(adjust.minutes)} min` : 'Confirm'}
        busy={busy}
        onCancel={() => setAdjust(null)}
        onConfirm={confirmAdjust}
      >
        {adjust && (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {QUICK_MINUTES.map((m) => {
                const value = shortening ? -m : m
                const Icon = shortening ? TimerOff : Timer
                return (
                  <button
                    key={m}
                    type="button"
                    disabled={shortening && m > maxReduction(adjust.event, adjustNow)}
                    onClick={() => setAdjust({ ...adjust, minutes: value })}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${adjust.minutes === value ? 'border-brand-red bg-brand-red text-white' : 'border-stone-300 hover:border-brand-red'}`}
                  >
                    <Icon size={13} /> {signed(value)}
                  </button>
                )
              })}
              {shortening && adjustNow !== undefined && (
                <button
                  type="button"
                  onClick={() => setAdjust({ ...adjust, minutes: adjustNow - adjust.event.end })}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold transition ${adjust.minutes === adjustNow - adjust.event.end ? 'border-brand-red bg-brand-red text-white' : 'border-stone-300 hover:border-brand-red'}`}
                >
                  <TimerOff size={13} /> End now
                </button>
              )}
            </div>
            {adjustNow !== undefined && (
              <p className="mb-2 font-semibold text-brand-green">
                Live now ({fmt(adjustNow)}): {startsIn(adjustNow - adjust.event.start)} in, {startsIn(adjust.event.end - adjustNow)} left.
              </p>
            )}
            <p>
              It will end at <strong>{fmt(adjust.event.end + adjust.minutes)}</strong> instead of {fmt(adjust.event.end)}.
              {laterCount > 0 ? ` ${laterCount} later session${laterCount === 1 ? '' : 's'} on Day ${adjust.event.dayIndex + 1} will move ${shortening ? 'forward' : 'back'} by ${Math.abs(adjust.minutes)} min.` : ''}
            </p>
            <p className="mt-2 text-stone-500">An update will be posted to the live feed automatically.</p>
          </>
        )}
      </ConfirmDialog>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title ?? ''}
        confirmLabel={confirm?.label}
        tone={confirm?.tone}
        busy={busy}
        onCancel={() => setConfirm(null)}
        onConfirm={confirmAction}
      >
        {confirm?.body}
      </ConfirmDialog>

      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
