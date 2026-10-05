import { ArrowLeft, ArrowRight, Award, BookOpen, ChevronLeft, ChevronRight, Coffee, Mic2, Music2, Users2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { schedule } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'
import type { ScheduleItem } from '../lib/types/data'

function iconFor(activity: string) {
  if (/registration|hymn/i.test(activity)) return Music2
  if (/testimonial|closing|resolution|certification/i.test(activity)) return Award
  if (/panel/i.test(activity)) return Users2
  if (/tea break|lunch|break away/i.test(activity)) return Coffee
  if (/devotion|pastoral charge/i.test(activity)) return BookOpen
  return Mic2
}

function splitIntoColumns(items: ScheduleItem[]) {
  const teaIndex = items.findIndex((item) => /tea break/i.test(item.activity))
  const lunchIndex = items.findIndex((item, i) => i > teaIndex && /lunch/i.test(item.activity))

  if (teaIndex === -1) return [items, [], []]
  if (lunchIndex === -1) return [items.slice(0, teaIndex + 1), items.slice(teaIndex + 1), []]

  return [
    items.slice(0, teaIndex + 1),
    items.slice(teaIndex + 1, lunchIndex + 1),
    items.slice(lunchIndex + 1),
  ]
}

function getInitialDayIndex() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dates = schedule.map((day) => new Date(day.isoDate))

  if (today <= dates[0]) return 0
  if (today >= dates[dates.length - 1]) return dates.length - 1

  const match = dates.findIndex((date) => date.getTime() === today.getTime())
  return match === -1 ? 0 : match
}

function ScheduleColumn({ items }: { items: ScheduleItem[] }) {
  if (items.length === 0) return null
  return (
    <ol>
      {items.map((item, i) => {
        const Icon = iconFor(item.activity)
        const isLast = i === items.length - 1
        return (
          <li key={item.time + item.activity} className="relative flex gap-4 pb-7 last:pb-0">
            {!isLast && <span className="absolute left-3.75 top-8 bottom-0 w-px bg-stone-200" />}
            <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-cream text-brand-red ring-4 ring-white">
              <Icon size={15} />
            </span>
            <div className="pt-0.5">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-green">{item.time}</p>
              <p className="mt-0.5 font-bold leading-snug text-stone-900">{item.activity}</p>
              {item.facilitator && <p className="mt-0.5 text-sm font-semibold text-brand-red">{item.facilitator}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default function Schedule() {
  const [dayIndex, setDayIndex] = useState(getInitialDayIndex)
  const cardRef = useRef<HTMLElement>(null)
  const day = schedule[dayIndex]
  const columns = splitIntoColumns(day.items)

  function goToDay(index: number) {
    setDayIndex(index)
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="schedule" className="bg-white px-5 py-10 pt-20 lg:px-8">
      <motion.div {...revealProps}>
        <SectionHeading eyebrow="Conference Schedule" title="Three days of worship, teaching, workshops, and prayer." strokeWord="Schedule" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDayIndex((i) => Math.max(0, i - 1))}
              disabled={dayIndex === 0}
              aria-label="Previous day"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-red text-white transition hover:bg-brand-dark disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => setDayIndex((i) => Math.min(schedule.length - 1, i + 1))}
              disabled={dayIndex === schedule.length - 1}
              aria-label="Next day"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-red text-white transition hover:bg-brand-dark disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <article ref={cardRef} className="scroll-mt-24 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 bg-brand-dark px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">{day.day}</p>
                <p className="mt-1 text-xl font-bold text-white display">{day.date}</p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-red text-lg font-extrabold text-white">
                {dayIndex + 1}
              </span>
            </div>
            <div className={`grid gap-8 p-6 ${dayIndex === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`} >
              {columns.map((columnItems, i) => (
                <ScheduleColumn key={i} items={columnItems} />
              ))}
            </div>
           
          </article> <div className="flex items-center justify-between gap-4 px-6 py-5">
              {dayIndex > 0 && (
                <button
                  type="button"
                  onClick={() => goToDay(dayIndex - 1)}
                  className="inline-flex items-center cursor-pointer gap-2 rounded-full border border-brand-red px-5 py-2.5 text-sm font-bold text-brand-red transition hover:bg-brand-red hover:text-white"
                >
                  <ArrowLeft size={16} />
                  <span>Previous day</span>
                </button>
              )}
              {dayIndex < schedule.length - 1 && (
                <button
                  type="button"
                  onClick={() => goToDay(dayIndex + 1)}
                  className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
                >
                  <span>Next day</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
        </div>
      </motion.div>
    </section>
  )
}
