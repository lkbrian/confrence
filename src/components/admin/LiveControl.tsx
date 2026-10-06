import { Clock, Radio, Square, Timer, TimerOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { QUICK_MINUTES } from '@/lib/adminStyles'
import { fmt, maxReduction, signed, startsIn, type ConferenceClock } from '@/lib/timeline'
import type { LiveEvent, LiveStatus } from '@/lib/types/happening'
import AdminPanel from './AdminPanel'

type LiveControlProps = { status: LiveStatus; clock: ConferenceClock; onAdjust: (event: LiveEvent, minutes: number) => void }

export default function LiveControl({ status, clock, onAdjust }: LiveControlProps) {
  const [custom, setCustom] = useState('')
  const [customError, setCustomError] = useState('')
  const { current, upcoming, isConferenceDay, phase } = status

  function submitCustom(sign: 1 | -1) {
    const minutes = Number(custom)
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) {
      setCustomError('Enter whole minutes between 1 and 120.')
      return
    }
    if (sign < 0 && minutes > maxReduction(current!, clock.minutes)) {
      setCustomError(`This session can be shortened by at most ${maxReduction(current!, clock.minutes)} min, it can't end before now.`)
      return
    }
    setCustomError('')
    onAdjust(current!, sign * minutes)
    setCustom('')
  }

  return (
    <AdminPanel
      title="Live control"
      description={isConferenceDay ? `Day ${status.dayIndex + 1} · Nairobi time ${fmt(clock.minutes)}` : `Not a conference day · ${fmt(clock.minutes)}`}
      icon={<Radio size={16} />}
    >
      {phase === 'live' && current ? (
        <div>
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-green" /> Happening now
          </p>
          <h3 className="mt-1 text-xl font-extrabold leading-snug">{current.activity}</h3>
          {current.facilitator && <p className="text-sm font-semibold text-brand-red">{current.facilitator}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-600">
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {fmt(current.start)} – {fmt(current.end)}</span>
            <span>{startsIn(clock.minutes - current.start)} in · ends in {startsIn(current.end - clock.minutes)}</span>
            {current.extendedBy !== 0 && <span className="rounded-full bg-brand-cream px-2 py-0.5 text-xs font-bold text-brand-dark">{current.extendedBy > 0 ? 'Extended' : 'Shortened'} {signed(current.extendedBy)} min</span>}
          </div>

          <p className="mt-5 text-sm font-semibold text-stone-800">Running over? Extend this session</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_MINUTES.map((m) => (
              <Button key={m} variant="outline" size="sm" onClick={() => onAdjust(current, m)} className="border-brand-red/40 text-brand-red hover:bg-brand-red hover:text-white">
                <Timer /> +{m} min
              </Button>
            ))}
          </div>

          <p className="mt-4 text-sm font-semibold text-stone-800">Finishing early? Shorten this session</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_MINUTES.map((m) => (
              <Button key={m} variant="outline" size="sm" disabled={m > maxReduction(current, clock.minutes)} onClick={() => onAdjust(current, -m)} className="border-brand-green/40 text-brand-green hover:bg-brand-green hover:text-white">
                <TimerOff /> −{m} min
              </Button>
            ))}
            {current.end - clock.minutes > 0 && (
              <Button variant="outline" size="sm" onClick={() => onAdjust(current, clock.minutes - current.end)} className="border-brand-green/40 text-brand-green hover:bg-brand-green hover:text-white">
                <Square /> End now ({fmt(clock.minutes)})
              </Button>
            )}
          </div>
          <form
            className="mt-3 flex items-start gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              submitCustom(1)
            }}
          >
            <div className="w-36">
              <input
                type="number"
                min={1}
                max={120}
                inputMode="numeric"
                placeholder="Custom min"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value)
                  setCustomError('')
                }}
                aria-invalid={Boolean(customError)}
                aria-label="Custom minutes"
                className="h-8 w-full rounded-full border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
              />
            </div>
            <Button type="submit" size="sm" className="bg-brand-dark hover:bg-brand-red">Extend</Button>
            <Button type="button" size="sm" variant="outline" onClick={() => submitCustom(-1)}>Shorten</Button>
          </form>
          {customError && <p className="mt-1.5 text-xs font-medium text-brand-red">{customError}</p>}
          {upcoming[0] && <p className="mt-4 text-sm text-stone-500">Next: <strong className="text-stone-700">{upcoming[0].activity}</strong> at {fmt(upcoming[0].start)}</p>}
        </div>
      ) : (
        <div className="rounded-xl bg-stone-50 px-4 py-6 text-center text-sm text-stone-600">
          <p className="font-semibold text-stone-800">No session is running right now.</p>
          {upcoming[0] ? (
            <p className="mt-1">Next: <strong>{upcoming[0].activity}</strong> at {fmt(upcoming[0].start)}.</p>
          ) : (
            <p className="mt-1">{isConferenceDay ? 'The programme for today has ended.' : 'Live controls are active during conference days.'}</p>
          )}
          <p className="mt-2 text-stone-500">You can still extend or shorten any session from the timeline.</p>
        </div>
      )}
    </AdminPanel>
  )
}
