import { ListOrdered, RotateCcw, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fmt } from '@/lib/timeline'
import type { LiveEvent } from '@/lib/types/happening'
import AdminPanel from './AdminPanel'

type TimelinePanelProps = {
  dayIndex: number
  events: LiveEvent[]
  currentId?: string
  onExtend: (event: LiveEvent) => void
  onReset: (event: LiveEvent) => void
}

export default function TimelinePanel({ dayIndex, events, currentId, onExtend, onReset }: TimelinePanelProps) {
  const totalShift = events.reduce((sum, e) => sum + e.extendedBy, 0)
  return (
    <AdminPanel
      title={`Day ${dayIndex + 1} timeline`}
      description={totalShift ? `Running ${totalShift} min behind the printed programme.` : 'On the printed programme.'}
      icon={<ListOrdered size={16} />}
    >
      <ol className="-mx-2 divide-y divide-stone-100">
        {events.map((event) => {
          const isCurrent = event.id === currentId
          return (
            <li key={event.id} className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-2 py-3 sm:flex-nowrap ${isCurrent ? 'bg-brand-cream' : ''}`}>
              <div className="w-28 shrink-0 text-sm tabular-nums">
                <span className="font-bold text-brand-dark">{fmt(event.start)}–{fmt(event.end)}</span>
                {(event.shiftedBy !== 0 || event.extendedBy !== 0) && (
                  <span className="block text-xs text-stone-400 line-through">{fmt(event.baseStart)}–{fmt(event.baseEnd)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-stone-900">
                  {event.activity}
                  {isCurrent && <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-brand-red">● Live</span>}
                </p>
                {event.facilitator && <p className="truncate text-xs text-stone-500">{event.facilitator}</p>}
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-1.5">
                {event.extendedBy > 0 && (
                  <>
                    <span className="rounded-full bg-brand-dark px-2 py-0.5 text-xs font-bold text-white">+{event.extendedBy}m</span>
                    <Button variant="ghost" size="sm" onClick={() => onReset(event)} aria-label={`Reset extension for ${event.activity}`}>
                      <RotateCcw />
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => onExtend(event)}>
                  <Timer /> Extend
                </Button>
              </div>
            </li>
          )
        })}
      </ol>
    </AdminPanel>
  )
}
