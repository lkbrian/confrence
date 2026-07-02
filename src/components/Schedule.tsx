import { Award, BookOpen, Coffee, Mic2, Music2, Users2 } from 'lucide-react'
import { schedule } from '../data'
import SectionHeading from './SectionHeading'

function iconFor(item: string) {
  if (/registration|hymn/i.test(item)) return Music2
  if (/testimonial|closing|resolution|certification/i.test(item)) return Award
  if (/panel/i.test(item)) return Users2
  if (/break/i.test(item)) return Coffee
  if (/devotion|pastoral charge/i.test(item)) return BookOpen
  return Mic2
}

function parseItem(item: string) {
  const [title, speaker] = item.split(' – ')
  return { title: title.trim(), speaker: speaker?.trim() }
}

export default function Schedule() {
  return (
    <section id="schedule" className="bg-white px-5 py-10 pt-20 lg:px-8">
      <SectionHeading eyebrow="Conference Schedule" title="Three days of worship, teaching, workshops, and prayer." strokeWord="Schedule" />
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        {schedule.map((day, dayIndex) => (
          <article key={day.day} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 bg-brand-dark px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">{day.day}</p>
                <p className="mt-1 flex items-center gap-2 text-xl font-bold text-white display">
                  {/* <Clock3 size={14} />  */}
                  {day.date}
                </p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-red text-lg font-extrabold text-white">
                {dayIndex + 1}
              </span>
            </div>
            <ol className="p-6">
              {day.items.map((item, i) => {
                const { title, speaker } = parseItem(item)
                const Icon = iconFor(item)
                const isLast = i === day.items.length - 1
                return (
                  <li key={item} className="relative flex gap-4 pb-7 last:pb-0">
                    {!isLast && <span className="absolute left-3.75 top-8 bottom-0 w-px bg-stone-200" />}
                    <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-cream text-brand-red ring-4 ring-white">
                      <Icon size={15} />
                    </span>
                    <div className="pt-0.5">
                      <p className="font-bold leading-snug text-stone-900">{title}</p>
                      {speaker && <p className="mt-0.5 text-sm font-semibold text-brand-red">{speaker}</p>}
                    </div>
                  </li>
                )
              })}
            </ol>
          </article>
        ))}
      </div>
    </section>
  )
}
