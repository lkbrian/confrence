import { useSchedule } from '../../../lib/scheduleStore'

type DayTabsProps = { selected: number; today: number | null; onSelect: (index: number) => void }

export default function DayTabs({ selected, today, onSelect }: DayTabsProps) {
  const schedule = useSchedule()
  return (
    <div role="tablist" aria-label="Conference days" className="grid grid-cols-3 overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm">
      {schedule.map((day, i) => {
        const active = i === selected
        const [weekday, rest] = day.date.split(', ')
        return (
          <button
            key={day.isoDate}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(i)}
            className={`relative px-2 py-3 text-center transition sm:py-4 ${i > 0 ? 'border-l border-stone-200' : ''} ${active ? 'bg-brand-red text-white' : 'hover:bg-brand-cream'}`}
          >
            <span className={`block text-xs font-extrabold uppercase tracking-[0.16em] ${active ? 'text-white/80' : 'text-brand-green'}`}>Day 0{i + 1}</span>
            <span className="mt-0.5 block text-sm font-bold sm:text-base">
              <span className="hidden sm:inline">{weekday}, </span>
              {rest?.replace(/ 2026$/, '') ?? day.date}
            </span>
            {today === i && (
              <span className={`mt-1 inline-block rounded-sm px-2 text-[10px] font-extrabold uppercase tracking-wider ${active ? 'bg-white text-brand-red' : 'bg-brand-red text-white'}`}>Today</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
