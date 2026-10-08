import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Loader2, MapPin, Phone, User, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listDayPhotos } from '@/lib/happening'
import { revealProps } from '@/lib/motion'
import {
  fetchMyRegistration,
  forgetPhone,
  formatPhone,
  getSavedPhone,
  normalizePhone,
  savePhone,
  submitFourthRegistration,
  type FourthRegistration,
} from '@/lib/fourthConference'
import type { RegistrationStatus } from '@/lib/types/ui'

const inputClass =
  'w-full rounded-lg border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20'


function useDayOnePhotos() {
  const [photos, setPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listDayPhotos(1)
      .then((urls) => setPhotos(urls.slice(0, 6)))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false))
  }, [])

  return { photos, loading }
}

function PhotoMosaic({ photos, loading }: { photos: string[]; loading: boolean }) {
  if (!loading && photos.length === 0) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-sm border border-white/15 bg-white/5">
        <img src="/aic-logo.png" alt="" className="w-48 rounded-md bg-white p-2 opacity-90" />
      </div>
    )
  }

  // The first photo spans two rows; the other five fill the 3-column grid around it.
  const tiles = loading ? Array.from({ length: 6 }, () => '') : photos.slice(0, 6)
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {tiles.map((src, i) => (
        <motion.div
          key={src || i}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className={`overflow-hidden rounded-sm bg-white/10 ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'} ${loading ? 'animate-pulse' : ''}`}
        >
          {src && (
            <img
              src={src}
              alt={`Day one of the Pastors Conference, photo ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="size-full object-cover transition duration-700 hover:scale-105"
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

function MyRegistration({ registration, notice, onBack }: { registration: FourthRegistration; notice: string; onBack: () => void }) {
  const details = [
    { label: 'Full Name', value: registration.name },
    { label: 'Phone Number', value: formatPhone(registration.phone) },
    { label: 'Area', value: registration.area },
    { label: 'M-Pesa Code', value: registration.mpesa_code ?? 'Not provided', mono: !!registration.mpesa_code },
    {
      label: 'Registered On',
      value: new Date(registration.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }),
    },
  ]

  return (
    <div className="rounded-2xl bg-white p-7 shadow-2xl sm:p-10">
      <div className="flex items-start gap-4">
        <CheckCircle2 size={44} className="shrink-0 text-brand-green" />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-red">2027 Conference</p>
          <h2 className="mt-1 text-2xl font-extrabold text-brand-dark sm:text-3xl">Your Registration</h2>
          {notice && <p className="mt-1 text-sm text-stone-500">{notice}</p>}
        </div>
      </div>

      <dl className="mt-7 divide-y divide-stone-100 rounded-xl border border-stone-200 bg-stone-50">
        {details.map(({ label, value, mono }) => (
          <div key={label} className="flex flex-col gap-0.5 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">{label}</dt>
            <dd className={`font-semibold text-brand-dark sm:text-right ${mono ? 'font-mono uppercase tracking-wide' : ''}`}>{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-sm leading-6 text-stone-500">
        See you on 5th to 7th October 2027. We will call or text you on this number once the venue is confirmed.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-4 font-bold text-white transition hover:bg-brand-dark"
      >
        <ArrowLeft size={18} /> Back to the form
      </button>
    </div>
  )
}

export default function NextConference() {
  const { photos, loading } = useDayOnePhotos()
  const [status, setStatus] = useState<RegistrationStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  // The visitor's registration (found through the phone saved on this device) and whether it is showing.
  const [mine, setMine] = useState<FourthRegistration | null>(null)
  const [notice, setNotice] = useState('')
  const [view, setView] = useState<'form' | 'mine'>('form')

  useEffect(() => {
    const phone = getSavedPhone()
    if (!phone) return
    fetchMyRegistration(phone)
      .then((found) => {
        if (!found) return forgetPhone() // Removed by an admin since.
        setMine(found)
        setNotice('You have already registered from this device.')
        setView('mine')
      })
      .catch(() => {
        // Lookup unavailable: the form still works.
      })
  }, [])

  function showMine(registration: FourthRegistration, message: string) {
    savePhone(registration.phone)
    setMine(registration)
    setNotice(message)
    setView('mine')
    setStatus('idle')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const phone = normalizePhone(String(data.get('phone') ?? ''))
    if (!/^\d{9,15}$/.test(phone)) {
      setErrorMsg('Please enter a valid phone number, e.g. 0712 345 678.')
      setStatus('error')
      return
    }
    const mpesa = String(data.get('mpesa_code') ?? '').trim().toUpperCase()
    if (mpesa && !/^[A-Z0-9]{8,12}$/.test(mpesa)) {
      setErrorMsg('That M-Pesa code doesn’t look right. It is usually 10 letters and numbers, or leave it blank.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')
    const registration = {
      name: String(data.get('name') ?? '').replace(/\s+/g, ' ').trim(),
      phone,
      mpesa_code: mpesa || null,
      area: String(data.get('area') ?? '').replace(/\s+/g, ' ').trim(),
    }
    try {
      const { registration: saved, updated } = await submitFourthRegistration(registration)
      form.reset()
      showMine(
        saved,
        updated ? 'This phone number was already registered, so we updated its details.' : 'Thank you for registering. You’re on the list!',
      )
    } catch (err) {
      setErrorMsg((err as Error).message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

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

      <section className="relative overflow-hidden bg-brand-dark px-5 pb-24 pt-14 text-white lg:px-8 lg:pb-32 lg:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-brand-green/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-brand-red/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <motion.div {...revealProps}>
            <p className="inline-flex items-center gap-2  px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
              <span className="size-2 animate-pulse rounded-full bg-brand-green" /> Registration open
            </p>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-white/70">
              4th AIC National Pastors Conference, 2027
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Shepherding the <span className="text-brand-red">Nation</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
              What God did this year was only the beginning. Reserve your place for the next gathering, and we will
              share the venue with you in good time.
            </p>
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">Date</dt>
                <dd className="mt-1 text-lg font-bold">5th to 7th October 2027</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">Theme</dt>
                <dd className="mt-1 text-lg font-bold">Shepherding the Nation</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">Venue</dt>
                <dd className="mt-1 text-lg font-bold">Will be shared in time</dd>
              </div>
            </dl>
          </motion.div>

          <motion.div {...revealProps}>
            <PhotoMosaic photos={photos} loading={loading} />
            {photos.length > 0 && (
              <p className="mt-3 text-right text-xs uppercase tracking-[0.18em] text-white/50">Moments from Day One</p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="relative px-5 pb-20 lg:px-8">
        <motion.div {...revealProps} className="mx-auto -mt-14 max-w-2xl lg:-mt-20">
          {view === 'mine' && mine ? (
            <MyRegistration registration={mine} notice={notice} onBack={() => setView('form')} />
          ) : (
          <form className="rounded-2xl bg-white p-7 shadow-2xl sm:p-10" onSubmit={handleSubmit}>
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-red">2027 Conference</p>
                  {mine && (
                    <button
                      type="button"
                      onClick={() => setView('mine')}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-brand-green/10 px-3.5 py-1.5 text-xs font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
                    >
                      <ClipboardCheck size={14} /> View my registration
                    </button>
                  )}
                </div>
                <h2 className="mt-2 text-2xl font-extrabold text-brand-dark sm:text-3xl">Reserve Your Place</h2>
                <p className="mt-1 text-sm text-stone-500">
                  It takes less than a minute. No account needed. Already registered? Submit again with the same phone
                  number to update your details.
                </p>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-bold text-stone-700" htmlFor="next-name">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input id="next-name" name="name" type="text" required minLength={2} maxLength={120} autoComplete="name" placeholder="e.g. Pastor John Kamau" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-stone-700" htmlFor="next-phone">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input id="next-phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder="e.g. 0712 345 678" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-stone-700" htmlFor="next-area">
                      Area
                    </label>
                    <div className="relative">
                      <MapPin size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input id="next-area" name="area" type="text" required minLength={2} maxLength={120} placeholder="e.g. Machakos" className={inputClass} />
                    </div>
                    <p className="mt-1.5 text-xs text-stone-400">The town or region you are coming from.</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-stone-700" htmlFor="next-mpesa">
                      M-Pesa Transaction Code
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-500">Optional</span>
                    </label>
                    <div className="relative">
                      <Wallet size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input id="next-mpesa" name="mpesa_code" type="text" maxLength={12} autoComplete="off" placeholder="e.g. QJZ8X4K2RT" className={`${inputClass} font-mono uppercase`} />
                    </div>
                    <p className="mt-1.5 text-xs text-stone-400">Already paid? Add the code from your confirmation SMS. Otherwise leave it blank.</p>
                  </div>
                </div>

                {status === 'error' && (
                  <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-4 font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      Register Interest <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </>
          </form>
          )}
        </motion.div>
      </section>
    </main>
  )
}
