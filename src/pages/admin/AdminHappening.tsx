import { AlertCircle, ExternalLink, Loader2, Timer, TriangleAlert } from 'lucide-react'
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
import { deleteAnnouncement, deleteUpdate, extendEvent, resetAll, resetExtension, useHappening } from '@/lib/happening'
import { useSchedule } from '@/lib/scheduleStore'
import { buildDay, fmt, useClock } from '@/lib/timeline'
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

  const [extend, setExtend] = useState<{ event: LiveEvent; minutes: number } | null>(null)
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null)
  const [busy, setBusy] = useState(false)

  const run = useAdminRun(push, refresh)

  async function confirmExtend() {
    if (!extend) return
    setBusy(true)
    const { event, minutes } = extend
    const ok = await run(() => extendEvent(event, minutes), `${event.activity} extended by ${minutes} min. Now ends at ${fmt(event.end + minutes)}.`)
    setBusy(false)
    if (ok) setExtend(null)
  }

  async function confirmAction() {
    if (!confirm) return
    setBusy(true)
    const ok = await run(confirm.action, confirm.success)
    setBusy(false)
    if (ok) setConfirm(null)
  }

  const extendEvents = extend ? buildDay(extend.event.dayIndex, data.extensions) : []
  const laterCount = extend ? extendEvents.length - extend.event.index - 1 : 0

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
            <LiveControl status={status} clock={clock} onExtend={(event, minutes) => setExtend({ event, minutes })} />
            <TimelinePanel
              dayIndex={dayIndex}
              events={events}
              currentId={status.isConferenceDay && dayIndex === status.dayIndex ? status.current?.id : undefined}
              onExtend={(event) => setExtend({ event, minutes: 15 })}
              onReset={(event) =>
                setConfirm({
                  title: `Remove the +${event.extendedBy} min extension?`,
                  body: `${event.activity} will end at ${fmt(event.end - event.extendedBy)} and later sessions move forward by ${event.extendedBy} min.`,
                  label: 'Remove extension',
                  action: () => resetExtension(event.id),
                  success: 'Extension removed. Times updated.',
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
        open={Boolean(extend)}
        title={extend ? `Extend "${extend.event.activity}"?` : ''}
        confirmLabel={extend ? `Extend +${extend.minutes} min` : 'Extend'}
        busy={busy}
        onCancel={() => setExtend(null)}
        onConfirm={confirmExtend}
      >
        {extend && (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {QUICK_MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setExtend({ ...extend, minutes: m })}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold transition ${extend.minutes === m ? 'border-brand-red bg-brand-red text-white' : 'border-stone-300 hover:border-brand-red'}`}
                >
                  <Timer size={13} /> +{m}
                </button>
              ))}
            </div>
            <p>
              It will end at <strong>{fmt(extend.event.end + extend.minutes)}</strong> instead of {fmt(extend.event.end)}.
              {laterCount > 0 ? ` ${laterCount} later session${laterCount === 1 ? '' : 's'} on Day ${extend.event.dayIndex + 1} will move back by ${extend.minutes} min.` : ''}
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
