import { ArrowRight, Bell, CalendarClock, Clock, Megaphone, Radio, Timer, Users } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useHappening } from '@/lib/happening'
import { useSchedule } from '@/lib/scheduleStore'
import { fetchRegistrations } from '@/lib/supabase'
import { fmt, getLiveStatus, signed, startsIn, useClock } from '@/lib/timeline'

function Stat({ label, value, icon, to }: { label: string; value: ReactNode; icon: ReactNode; to: string }) {
  return (
    <Link to={to} className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-brand-red/40 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-cream text-brand-red">{icon}</span>
        <ArrowRight size={16} className="text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-brand-red" />
      </div>
      <p className="mt-3 text-2xl font-extrabold tabular-nums text-stone-950 sm:text-3xl">{value}</p>
      <p className="text-sm text-stone-500">{label}</p>
    </Link>
  )
}

export default function AdminDashboard() {
  const clock = useClock(15_000)
  const schedule = useSchedule()
  const { data, loading } = useHappening()
  const [registrations, setRegistrations] = useState<number | null>(null)
  const [regError, setRegError] = useState(false)

  useEffect(() => {
    fetchRegistrations()
      .then((rows) => setRegistrations(rows.length))
      .catch(() => setRegError(true))
  }, [])

  const status = getLiveStatus(clock, data.extensions)
  const day = status.dayIndex + 1
  const totalShift = Object.entries(data.extensions)
    .filter(([id]) => id.startsWith(`d${day}-`))
    .reduce((sum, [, m]) => sum + m, 0)
  const updatesToday = data.updates.filter((u) => u.day === day).length
  const sessionsToday = schedule[status.dayIndex]?.items.length ?? 0
  const next = status.upcoming[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">Overview</p>
      <h1 className="mt-1 text-2xl font-extrabold text-stone-950 sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-600">
        {status.isConferenceDay ? `Day ${day} · ${schedule[status.dayIndex].date}` : 'Not a conference day'} · Nairobi time {fmt(clock.minutes)}
      </p>

      <section className="mt-5 overflow-hidden rounded-2xl bg-brand-dark text-white shadow-sm">
        <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            {status.phase === 'live' && status.current ? (
              <>
                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-green">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-brand-red" /> Happening now
                </p>
                <p className="mt-2 text-xl font-extrabold leading-snug sm:text-2xl">{status.current.activity}</p>
                <p className="mt-1 text-sm text-white/70">
                  {fmt(status.current.start)} – {fmt(status.current.end)} · ends in {startsIn(status.current.end - clock.minutes)}
                  {status.current.extendedBy !== 0 && ` · ${status.current.extendedBy > 0 ? 'extended' : 'shortened'} ${signed(status.current.extendedBy)} min`}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-green">Status</p>
                <p className="mt-2 text-xl font-extrabold sm:text-2xl">
                  {status.phase === 'after' ? (status.isConferenceDay ? `Day ${day} has ended` : 'Conference concluded') : 'No session running'}
                </p>
                {next && <p className="mt-1 text-sm text-white/70">Next: {next.activity} at {fmt(next.start)}</p>}
              </>
            )}
          </div>
          <Link to="/admin/happening" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3 text-sm font-bold transition hover:bg-brand-green md:justify-self-end">
            <Radio size={16} /> Manage live page
          </Link>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Stat to="/admin/registrations" label="Registrations" icon={<Users size={17} />} value={regError ? '—' : (registrations ?? '…')} />
        <Stat to="/admin/schedules" label={`Sessions on Day ${day}`} icon={<CalendarClock size={17} />} value={sessionsToday} />
        <Stat to="/admin/happening" label={`Updates on Day ${day}`} icon={<Megaphone size={17} />} value={loading ? '…' : updatesToday} />
        <Stat to="/admin/happening" label="Announcements" icon={<Bell size={17} />} value={loading ? '…' : data.announcements.length} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold"><Timer size={17} className="text-brand-red" /> Running time</h2>
          <p className="mt-2 text-sm text-stone-600">
            {totalShift === 0 ? `Day ${day} is running on the printed programme.` : `Day ${day} is running ${totalShift} min behind the printed programme.`}
          </p>
        </section>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold"><Clock size={17} className="text-brand-red" /> Coming up</h2>
          {status.upcoming.length === 0 ? (
            <p className="mt-2 text-sm text-stone-600">Nothing else scheduled today.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm">
              {status.upcoming.slice(0, 3).map((e) => (
                <li key={e.id} className="flex gap-3"><span className="w-11 shrink-0 font-bold tabular-nums text-brand-green">{fmt(e.start)}</span><span className="truncate">{e.activity}</span></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
