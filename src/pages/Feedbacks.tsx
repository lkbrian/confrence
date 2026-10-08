import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, MessageSquarePlus, Quote, Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFeedback, type FeedbackEntry } from '@/lib/supabase'
import PhotoBackdrop from '@/components/user/PhotoBackdrop'

function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'} />
      ))}
    </span>
  )
}

function FeedbackCard({ entry, index }: { entry: FeedbackEntry; index: number }) {
  const name = entry.name?.trim() || 'Anonymous'
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 12) * 0.04 }}
      className="mb-5 break-inside-avoid rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <Quote size={22} className="shrink-0 text-brand-red/70" />
        {entry.rating ? <Stars rating={entry.rating} /> : null}
      </div>
      <p className="mt-3 whitespace-pre-line leading-7 text-stone-700">{entry.message}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-dark text-sm font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-brand-dark">{name}</p>
          <p className="text-xs text-stone-400">
            {new Date(entry.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

export default function Feedbacks() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(
    () =>
      fetchFeedback()
        .then((rows) => {
          setEntries(rows)
          setError('')
        })
        .catch((err: Error) => setError(err.message || 'Could not load feedback.'))
        .finally(() => setLoading(false)),
    [],
  )

  useEffect(() => {
    load()
  }, [load])

  const rated = entries.filter((e) => e.rating)
  const average = rated.length ? rated.reduce((sum, e) => sum + (e.rating ?? 0), 0) / rated.length : 0

  return (
    <main className="min-h-screen bg-brand-cream text-stone-900">
      <header className="border-b border-brand-green/12 bg-brand-dark text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <Link to="/" className="flex items-center rounded-md bg-white p-1">
            <img className="w-44 sm:w-60" src="/aic-logo.png" alt="AIC Pastors Conference" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white">
            <ArrowLeft size={16} /> Back to site
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-brand-dark px-5 pb-16 pt-16 text-center text-white lg:px-8 lg:pb-20 lg:pt-20">
        <PhotoBackdrop />
        <div className="relative">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">Feedback</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">What Pastors Are Saying</h1>
        {!loading && entries.length > 0 && (
          <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-white/75">
            {rated.length > 0 && (
              <>
                <Stars rating={Math.round(average)} size={18} />
                <span className="font-bold text-white">{average.toFixed(1)}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            {entries.length} {entries.length === 1 ? 'response' : 'responses'}
          </p>
        )}
        <div className="mt-6">
          <Link
            to="/feedback"
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-green"
          >
            <MessageSquarePlus size={17} /> Share your feedback
          </Link>
        </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {error ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle className="size-8 text-brand-red" />
            <p className="font-semibold text-brand-dark">Couldn&apos;t load feedback</p>
            <p className="text-sm text-stone-500">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                load()
              }}
              className="mt-1 text-sm font-bold text-brand-red underline underline-offset-2 hover:text-brand-dark"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {[180, 120, 220, 150, 200, 130].map((h, i) => (
              <div key={i} style={{ height: h }} className="mb-5 animate-pulse break-inside-avoid rounded-2xl bg-white/70" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="py-16 text-center text-stone-500">No feedback yet. Be the first to share yours.</p>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {entries.map((entry, i) => (
              <FeedbackCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
