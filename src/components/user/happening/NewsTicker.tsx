import { Fragment } from 'react'
import { fmt } from '../../../lib/timeline'
import type { Announcement, LiveStatus, LiveUpdate } from '../../../lib/types/happening'

type NewsTickerProps = { status: LiveStatus; updates: LiveUpdate[]; announcements: Announcement[] }

/** Scrolling headline bar: what's live, what's next, latest updates and announcements. */
export default function NewsTicker({ status, updates, announcements }: NewsTickerProps) {
  const items: { label: string; text: string }[] = []
  if (status.phase === 'live' && status.current) {
    const c = status.current
    items.push({ label: 'Live now', text: `${c.activity}${c.facilitator ? ` — ${c.facilitator}` : ''}` })
  }
  status.upcoming.slice(0, 2).forEach((e, i) => items.push({ label: i === 0 ? `Next · ${fmt(e.start)}` : fmt(e.start), text: e.activity }))
  updates.slice(0, 3).forEach((u) => items.push({ label: 'Update', text: u.title }))
  announcements.slice(0, 3).forEach((a) => items.push({ label: 'Notice', text: a.title }))
  if (items.length === 0) items.push({ label: 'AIC Pastors Conference 2026', text: 'Trans-generational Mentorship · AIC Milimani, Nairobi' })

  // ~5s per item keeps the reading speed steady however many items there are.
  const duration = `${Math.max(25, items.length * 6)}s`

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="flex items-center gap-2 whitespace-nowrap px-5 text-sm">
            <span className="rounded-sm bg-white/15 px-1.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider">{item.label}</span>
            <span className="font-semibold">{item.text}</span>
          </span>
          <span className="text-white/40">◆</span>
        </Fragment>
      ))}
    </div>
  )

  return (
    <div className="flex items-stretch overflow-hidden bg-brand-red text-white" role="marquee" aria-label="Latest conference news">
      <span className="z-10 flex shrink-0 items-center gap-2 bg-brand-dark px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.18em]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-brand-red" /> Live
      </span>
      <div className="relative flex min-w-0 flex-1 overflow-hidden py-2.5">
        <div className="animate-ticker flex w-max" style={{ ['--ticker-duration' as string]: duration }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
