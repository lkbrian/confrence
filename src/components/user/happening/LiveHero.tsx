import { Clock, MapPin, Timer } from 'lucide-react'
import { useSchedule } from '../../../lib/scheduleStore'
import { sessionBrief, speakerFor, VENUE } from '../../../lib/happeningMeta'
import BibleFactRotator from './BibleFactRotator'
import { buildDay, fmt, signed, startsIn, type ConferenceClock } from '../../../lib/timeline'
import type { Extensions, LiveStatus } from '../../../lib/types/happening'

const HERO_IMAGE = '/gallery/IMG_6916.jpg'

type LiveHeroProps = { status: LiveStatus; clock: ConferenceClock; extensions: Extensions }

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-white" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
    </span>
  )
}

/** Status pill + the event name as the headline, with its time slot and length underneath. */
function HappeningNow({ status, clock, extensions }: LiveHeroProps) {
  const schedule = useSchedule()
  const { current, upcoming, phase, dayIndex, isConferenceDay } = status
  const live = phase === 'live' && current
  // Live: the running session. Before / between sessions: the next one. After: nothing to show.
  const event = live ? current : phase === 'before' || phase === 'between' ? upcoming[0] : undefined

  let pill: string
  let fallbackTitle = ''
  let detail = ''
  if (live) {
    pill = 'Happening now'
  } else if (!isConferenceDay && phase === 'before') {
    pill = 'Coming soon'
    detail = `The conference opens ${schedule[0].date} at ${VENUE}.`
  } else if (!isConferenceDay) {
    pill = 'That’s a wrap'
    fallbackTitle = 'Thank you for joining us'
    detail = 'The conference has concluded. Catch up on the highlights below.'
  } else if (phase === 'after') {
    const tomorrow = schedule[dayIndex + 1]
    pill = `Day ${dayIndex + 1} done`
    fallbackTitle = tomorrow ? 'See you tomorrow' : 'Thank you for joining us'
    detail = tomorrow
      ? `Day ${dayIndex + 2} begins at ${fmt(buildDay(dayIndex + 1, extensions)[0].start)}.`
      : 'Thank you for joining us for three days of worship, teaching and fellowship.'
  } else if (phase === 'before') {
    pill = `Day ${dayIndex + 1} starts soon`
  } else {
    pill = 'On a short break · up next'
  }

  // The shown session's position across the whole conference picks the fact, so it changes with the
  // session. With no session (day / conference over) use a slot after all sessions, one per day.
  const sessionsBefore = schedule.slice(0, dayIndex).reduce((n, d) => n + d.items.length, 0)
  const totalSessions = schedule.reduce((n, d) => n + d.items.length, 0)
  const factKey = event ? sessionsBefore + event.index : totalSessions + dayIndex

  const title = event?.activity ?? fallbackTitle
  const titleSize = title.length > 45 ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-3xl sm:text-5xl lg:text-6xl'
  const speaker = live ? speakerFor(current) : undefined
  const progress = live ? Math.min(100, Math.max(0, ((clock.minutes - current.start) / (current.end - current.start)) * 100)) : 0

  return (
    <div className="mb-6 lg:mb-14">
      <span className="inline-flex items-center gap-3.5 rounded-full bg-brand-red py-1.5 pl-4 pr-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-lg sm:text-sm">
        <LiveDot /> {pill}
        {live && (
          <>
            <span className="h-3.5 w-px bg-white/40" aria-hidden />
            <time className="tabular-nums tracking-[0.08em]" aria-label={`Current time ${fmt(clock.minutes)}`}>{fmt(clock.minutes)}</time>
          </>
        )}
      </span>

      <h1 className={`mt-4 max-w-4xl font-black uppercase leading-[1.05] tracking-tight text-white display ${titleSize}`}>{title}</h1>

      {event ? (
        <>
          {event.facilitator && (
            <p className="mt-3 flex items-center gap-2.5 font-semibold text-brand-green sm:text-lg">
              {speaker && (
                <img
                  src={speaker.image}
                  alt=""
                  style={{ objectPosition: speaker.imagePosition ?? 'top' }}
                  className="h-9 w-9 shrink-0 rounded-sm object-cover ring-2 ring-white/25"
                />
              )}
              {event.facilitator}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85 sm:text-base">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Clock size={16} /> {fmt(event.start)} – {fmt(event.end)} · {event.end - event.start} min
            </span>
            {live ? (
              <>
                <span className="inline-flex items-center gap-1.5"><MapPin size={16} /> Main Auditorium</span>
                <span>Ends in {startsIn(current.end - clock.minutes)}</span>
              </>
            ) : (
              isConferenceDay && event.start > clock.minutes && <span>Starts in {startsIn(event.start - clock.minutes)}</span>
            )}
            {event.extendedBy !== 0 && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-white/15 px-2.5 py-0.5 text-xs font-bold text-white">
                <Timer size={13} /> {event.extendedBy > 0 ? 'Extended' : 'Shortened'} {signed(event.extendedBy)} min
              </span>
            )}
          </div>
          {live && (
            <div className="mt-3 h-1.5 max-w-xl overflow-hidden rounded-sm bg-white/20">
              <div className="h-full rounded-sm bg-brand-red transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>
          )}
          {(sessionBrief(event) || detail) && <p className="mt-3 max-w-2xl text-white/80 sm:text-lg">{sessionBrief(event) || detail}</p>}
        </>
      ) : (
        detail && <p className="mt-4 max-w-2xl text-lg text-white/80">{detail}</p>
      )}
      <BibleFactRotator factKey={factKey} className="mt-5 border-t border-white/15 pt-4" />
    </div>
  )
}

function UpNextCard({ status, clock }: LiveHeroProps) {
  // When nothing is live the headline already shows upcoming[0], so the card moves one along.
  const live = status.phase === 'live'
  const next = status.upcoming[live ? 0 : 1]
  if (!next) return null
  const startsToday = status.isConferenceDay
  return (
    <div className="w-fit max-w-sm rounded-sm bg-white px-6 py-5 shadow-xl lg:justify-self-end">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-red">Coming up</p>
      <p className="mt-2 text-2xl font-extrabold leading-tight text-stone-950">{live ? 'Up next' : 'After that'}: {next.activity}</p>
      <p className="mt-2 text-stone-600">
        Starts at {fmt(next.start)}
        {startsToday && next.start > clock.minutes && <> — in {startsIn(next.start - clock.minutes)}</>}.
      </p>
    </div>
  )
}

export default function LiveHero(props: LiveHeroProps) {
  return (
    <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-brand-dark">
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-dark via-brand-dark/75 to-brand-dark/50" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 pb-10 pt-28 sm:px-5 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:px-8">
        <HappeningNow {...props} />
        <UpNextCard {...props} />
      </div>
    </section>
  )
}
