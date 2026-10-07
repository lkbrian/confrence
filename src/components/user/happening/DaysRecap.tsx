import { useState } from 'react'
import { useSchedule } from '../../../lib/scheduleStore'
import type { DayRecap } from '../../../lib/types/happening'
import Panel from './Panel'
import { EmptyPhotos } from './PhotoGrid'

const PREVIEW_PHOTOS = 12

type DaysRecapProps = {
  recaps: Record<number, DayRecap>
  /** Day index (0-based) to open on: today, or the day being viewed. */
  initialDay: number
  /** Today's ISO date, to word the "no recap yet" message. */
  todayIso: string
  onOpenPhotos: (photos: string[], index: number) => void
}

/** End-of-day recap, one day at a time, with tabs to switch days. */
export default function DaysRecap({ recaps, initialDay, todayIso, onOpenPhotos }: DaysRecapProps) {
  const schedule = useSchedule()
  const [dayIndex, setDayIndex] = useState(initialDay)
  const [expanded, setExpanded] = useState(false)
  const [allPhotos, setAllPhotos] = useState(false)
  const day = schedule[dayIndex]
  const recap = recaps[dayIndex + 1]
  const hasRecap = Boolean(recap?.text || recap?.images.length)
  const when = day.isoDate < todayIso ? 'past' : day.isoDate === todayIso ? 'today' : 'upcoming'
  const images = recap?.images ?? []
  const shown = allPhotos ? images : images.slice(0, PREVIEW_PHOTOS)
  const long = (recap?.text?.length ?? 0) > 280

  const tabs = (
    <div role="tablist" aria-label="Recap day" className="flex shrink-0 gap-1">
      {schedule.map((d, i) => (
        <button
          key={d.isoDate}
          type="button"
          role="tab"
          aria-selected={i === dayIndex}
          onClick={() => {
            setDayIndex(i)
            setExpanded(false)
            setAllPhotos(false)
          }}
          className={`rounded-sm px-3 py-1.5 text-xs font-bold transition ${i === dayIndex ? 'bg-brand-red text-white' : 'bg-stone-100 text-stone-600 hover:bg-brand-cream'}`}
        >
          Day {i + 1}
        </button>
      ))}
    </div>
  )

  return (
    <Panel eyebrow="End of day" title={`Day ${dayIndex + 1} Recap`} action={tabs}>
      <p className="-mt-3 mb-4 text-sm text-stone-500">{day.date}</p>
      {/* Summary on top, photos below in a masonry so each keeps its own shape. */}
      <div className="space-y-5">
        {hasRecap && recap.text ? (
            <div>
              <p className={`whitespace-pre-line leading-7 text-stone-700 ${expanded ? '' : 'line-clamp-6'}`}>{recap.text}</p>
              {long && (
                <button type="button" onClick={() => setExpanded((e) => !e)} className="mt-2 text-sm font-bold text-brand-red hover:underline">
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
        ) : (
          <p className="rounded-sm bg-stone-50 px-4 py-6 text-center text-stone-500">
            {hasRecap
              ? 'No written summary for this day.'
              : when === 'upcoming'
                ? `Day ${dayIndex + 1} is on ${day.date.replace(/ \d{4}$/, '')}. Its recap will appear here at the end of that day.`
                : when === 'today'
                  ? `The Day ${dayIndex + 1} recap will be posted at the end of the day.`
                  : `The Day ${dayIndex + 1} recap hasn’t been posted yet.`}
          </p>
        )}
        {shown.length > 0 ? (
          <div>
            <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4">
              {shown.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => onOpenPhotos(images, i)}
                  className="mb-2 block w-full break-inside-avoid overflow-hidden rounded-xs bg-stone-100 sm:mb-3"
                >
                  <img src={src} alt="" loading="lazy" className="block h-auto w-full transition duration-300 hover:scale-[1.03]" />
                </button>
              ))}
            </div>
            {images.length > PREVIEW_PHOTOS && (
              <button type="button" onClick={() => setAllPhotos((a) => !a)} className="mt-1 text-sm font-bold text-brand-red hover:underline">
                {allPhotos ? 'Show fewer photos' : `Show all ${images.length} photos`}
              </button>
            )}
          </div>
        ) : (
          <EmptyPhotos message={`No photos for Day ${dayIndex + 1} yet.`} />
        )}
      </div>
    </Panel>
  )
}
