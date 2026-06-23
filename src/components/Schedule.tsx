import { CheckCircle2, Clock3 } from 'lucide-react'
import { schedule } from '../data'
import SectionHeading from './SectionHeading'

export default function Schedule() {
  return (
    <section id="schedule" className="px-5 py-20 lg:px-8">
      <SectionHeading eyebrow="Conference Schedule" title="Three days of worship, teaching, workshops, and prayer." />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        {schedule.map((day) => (
          <article key={day.day} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <p className="flex items-center gap-2 font-bold text-[#F2B21A]">
              <Clock3 size={18} /> {day.date}
            </p>
            <h3 className="mt-3 text-3xl font-extrabold">{day.day}</h3>
            <ul className="mt-5 space-y-3 text-stone-600">
              {day.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#F2B21A]" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
