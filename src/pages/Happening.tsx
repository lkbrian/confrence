import { AlertCircle, ArrowLeft, Loader2, MessageSquare } from 'lucide-react'
import { useLayoutEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AnnouncementList from '@/components/user/happening/AnnouncementList'
import DaysRecap from '@/components/user/happening/DaysRecap'
import Lightbox from '@/components/user/happening/Lightbox'
import LiveHero from '@/components/user/happening/LiveHero'
import NewsTicker from '@/components/user/happening/NewsTicker'
import UpNext from '@/components/user/happening/UpNext'
import UpdatesFeed from '@/components/user/happening/UpdatesFeed'
import { useHappening } from '@/lib/happening'
import { useSchedule } from '@/lib/scheduleStore'
import { useClock } from '@/lib/timeline'
import { useLiveStatus } from '@/lib/useLiveStatus'

export default function Happening() {
  // Short tick so the page switches sessions promptly after the end-of-session re-check.
  const clock = useClock(5_000)
  const schedule = useSchedule()
  const { data, loading, error, refresh } = useHappening()
  const [params] = useSearchParams()
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const status = useLiveStatus(clock, data.extensions, refresh, 5)
  const dayParam = Number(params.get('day'))
  const selected = dayParam >= 1 && dayParam <= schedule.length ? dayParam - 1 : status.dayIndex
  const isToday = status.isConferenceDay && selected === status.dayIndex

  const updates = data.updates.filter((u) => u.day === selected + 1)
  const announcements = data.announcements.filter((a) => a.day === null || a.day === selected + 1)
  const recap = data.recaps[selected + 1]
  const photos = useMemo(
    () => [...new Set([...updates.flatMap((u) => (u.image_url ? [u.image_url] : [])), ...(recap?.images ?? [])])],
    [updates, recap],
  )
  const openPhoto = (src: string) => setLightbox({ photos, index: photos.indexOf(src) })
  const upcoming = isToday || (status.phase === 'before' && selected === status.dayIndex) ? status.upcoming : []

  return (
    <main className="relative min-h-screen bg-brand-cream text-stone-900">
      {/* Transparent, laid over the hero photo. */}
      <header className="absolute inset-x-0 top-0 z-30 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-8">
          <Link to="/" className="flex items-center rounded-sm bg-white p-1">
            <img className="w-40 sm:w-56" src="/aic-logo.png" alt="AIC Pastors Conference" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/feedback" aria-label="Feedback" className="inline-flex items-center gap-2 rounded-sm bg-white/15 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:bg-white/25">
              <MessageSquare size={16} /> <span className="hidden sm:inline">Feedback</span>
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-sm bg-brand-red px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-brand-dark">
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to site</span><span className="sm:hidden">Home</span>
            </Link>
          </div>
        </div>
      </header>

      <LiveHero status={status} clock={clock} extensions={data.extensions} />
      <NewsTicker status={status} updates={updates} announcements={announcements} />

      <div className="px-4 py-6 sm:px-5 sm:py-8 lg:px-8">
        {error && (
          <div role="alert" className="mx-auto mb-6 flex max-w-7xl items-start gap-2 rounded-sm border border-brand-red/25 bg-white px-4 py-3 text-sm text-brand-red">
            <AlertCircle size={17} className="mt-0.5 shrink-0" /> Live updates are temporarily unavailable. Session times shown follow the printed programme. ({error})
          </div>
        )}

        {loading ? (
          <div className="grid place-items-center py-20 text-stone-500">
            <Loader2 className="animate-spin" size={28} aria-label="Loading live updates" />
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mx-auto mb-6 max-w-7xl border-b border-stone-200 pb-8">
                <UpNext events={upcoming} />
              </div>
            )}
            {/* Updates + announcements side by side (equal height), Days Recap full width beneath. */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
              <UpdatesFeed updates={updates} onOpenPhoto={openPhoto} />
              <AnnouncementList announcements={announcements} />
              <div className="md:col-span-2">
                <DaysRecap
                  key={selected}
                  recaps={data.recaps}
                  initialDay={selected}
                  todayIso={clock.isoDate}
                  onOpenPhotos={(list, index) => setLightbox({ photos: list, index })}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <Lightbox
        photos={lightbox?.photos ?? []}
        index={lightbox?.index ?? null}
        onChange={(index) => setLightbox((lb) => (lb && index !== null ? { ...lb, index } : null))}
      />
    </main>
  )
}
