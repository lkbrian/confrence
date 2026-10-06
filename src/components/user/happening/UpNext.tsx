import { ArrowUpRight } from 'lucide-react'
import { sessionBrief, sessionCategory, sessionImage } from '../../../lib/happeningMeta'
import { fmt } from '../../../lib/timeline'
import type { LiveEvent } from '../../../lib/types/happening'

function Tags({ event }: { event: LiveEvent }) {
  const tags = [sessionCategory(event), `${event.end - event.start} min`]
  if (event.shiftedBy !== 0) tags.push(`Moved ${event.shiftedBy > 0 ? 'later' : 'earlier'} ${Math.abs(event.shiftedBy)} min`)
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span key={tag} className="rounded-sm border border-stone-300 px-2.5 py-0.5 text-xs font-semibold text-stone-700">{tag}</span>
      ))}
    </div>
  )
}

function Meta({ event }: { event: LiveEvent }) {
  return (
    <p className="text-xs font-semibold text-stone-500">
      <span className="text-brand-green">{fmt(event.start)}</span>
      {event.shiftedBy !== 0 && <span className="ml-1 text-stone-400 line-through">{fmt(event.baseStart)}</span>}
      {event.facilitator && <> • {event.facilitator}</>}
    </p>
  )
}

/** News-blog style: the next session featured large, the rest of the day as a compact list. */
export default function UpNext({ events }: { events: LiveEvent[] }) {
  const [featured, ...later] = events
  if (!featured) return null
  const image = sessionImage(featured)
  const brief = sessionBrief(featured)

  return (
    <section className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-[1.1fr_1fr]">
      <article>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-red">Up next</p>
        <div className="aspect-[4/3] overflow-hidden rounded-sm bg-stone-200">
          <img src={image.src} alt="" loading="lazy" style={{ objectPosition: image.position }} className="h-full w-full object-cover" />
        </div>
        <div className="mt-4">
          <Meta event={featured} />
          <h2 className="mt-1.5 flex items-start justify-between gap-3 text-xl font-extrabold leading-snug text-stone-950 sm:text-2xl">
            {featured.activity}
            <ArrowUpRight size={20} className="mt-1 shrink-0 text-stone-500" />
          </h2>
          {brief && <p className="mt-2 leading-7 text-stone-600">{brief}</p>}
          <Tags event={featured} />
        </div>
      </article>

      {later.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-red">Later today</p>
          <ol className="space-y-5">
            {later.map((event) => {
              const img = sessionImage(event)
              const text = sessionBrief(event)
              return (
                <li key={event.id} className="grid grid-cols-[7.5rem_1fr] gap-4 sm:grid-cols-[11rem_1fr]">
                  <div className="aspect-[4/3] overflow-hidden rounded-sm bg-stone-200">
                    <img src={img.src} alt="" loading="lazy" style={{ objectPosition: img.position }} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Meta event={event} />
                    <h3 className="mt-1 font-bold leading-snug text-stone-950">{event.activity}</h3>
                    {text && <p className="mt-1 line-clamp-2 text-sm text-stone-600">{text}</p>}
                    <Tags event={event} />
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </section>
  )
}
