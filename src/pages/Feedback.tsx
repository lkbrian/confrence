import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitFeedback } from '@/lib/supabase'
import type { RegistrationStatus } from '@/lib/types/ui'
import PhotoBackdrop from '@/components/user/PhotoBackdrop'

const RATINGS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent']

const fieldClass =
  'w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20'

export default function Feedback() {
  const [status, setStatus] = useState<RegistrationStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    setStatus('loading')
    setErrorMsg('')
    try {
      await submitFeedback({
        name: String(data.get('name') ?? '').replace(/\s+/g, ' ').trim() || null,
        rating: rating || null,
        message: String(data.get('message') ?? '').trim(),
      })
      form.reset()
      setRating(0)
      setStatus('success')
    } catch (err) {
      setErrorMsg((err as Error).message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const shown = hover || rating

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

      <section className="relative overflow-hidden bg-brand-dark px-5 pb-40 pt-24 text-center text-white lg:px-8 lg:pb-48 lg:pt-32">
        <PhotoBackdrop />
        <div className="relative">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">Feedback</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">How was the conference?</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          Tell us what blessed you and what we can do better. Your name is optional.
        </p>
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8">
        <div className="relative z-10 mx-auto -mt-28 max-w-xl lg:-mt-36 rounded-2xl bg-white p-7 shadow-2xl sm:p-10">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle2 size={52} className="text-brand-green" />
              <h2 className="text-2xl font-extrabold text-brand-dark">Thank you!</h2>
              <p className="text-stone-500">Your feedback has been received. God bless you.</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-2 text-sm font-bold text-brand-red underline underline-offset-2 hover:text-brand-dark"
              >
                Send more feedback
              </button>
              <Link to="/feedbacks" className="text-sm font-bold text-brand-dark underline underline-offset-2 hover:text-brand-red">
                See what others are saying
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset>
                <legend className="mb-2 text-sm font-bold text-stone-700">Your rating</legend>
                <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                  {RATINGS.map((label, i) => {
                    const value = i + 1
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-label={`${value} star${value > 1 ? 's' : ''}: ${label}`}
                        aria-pressed={rating === value}
                        onClick={() => setRating(rating === value ? 0 : value)}
                        onMouseEnter={() => setHover(value)}
                        className="rounded-md p-1 transition hover:scale-110"
                      >
                        <Star size={30} className={value <= shown ? 'fill-amber-400 text-amber-400' : 'text-stone-300'} />
                      </button>
                    )
                  })}
                  <span className="ml-2 text-sm font-medium text-stone-500">{shown ? RATINGS[shown - 1] : 'Optional'}</span>
                </div>
              </fieldset>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-stone-700" htmlFor="feedback-message">
                  Your feedback
                </label>
                <textarea
                  id="feedback-message"
                  name="message"
                  required
                  minLength={2}
                  maxLength={2000}
                  rows={5}
                  placeholder="What stood out to you? What could we improve?"
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-stone-700" htmlFor="feedback-name">
                  Name
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-500">Optional</span>
                </label>
                <input id="feedback-name" name="name" type="text" maxLength={120} autoComplete="name" placeholder="Leave blank to stay anonymous" className={fieldClass} />
              </div>

              {status === 'error' && (
                <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-4 font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send Feedback <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
