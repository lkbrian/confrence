import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { submitRegistration } from '../lib/supabase'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'
import type { RegistrationStatus } from '../lib/types/ui'

const included = ['Conference materials', 'Meals during the event', 'Facilitator costs']

export default function Register() {
  const [status, setStatus] = useState<RegistrationStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    setStatus('loading')
    setErrorMsg('')

    try {
      await submitRegistration({
        full_name: data.get('full_name') as string,
        email: data.get('email') as string,
        mpesa_transaction_code: data.get('mpesa_transaction_code') as string,
      })
      setStatus('success')
      form.reset()
    } catch (err) {
      setErrorMsg((err as Error).message ?? 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section id="register" className="bg-brand-dark px-5 py-20 text-white lg:px-8">
      <motion.div {...revealProps}>
      <SectionHeading eyebrow="Registration" title="Register for the Conference" light strokeWord="Register" />
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_1.4fr]">

        <article className="rounded-2xl border border-white/20 bg-white/10 p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">Conference Fee</p>
          <p className="mt-4 text-4xl font-extrabold lg:text-5xl">KSh 4,500</p>
          <p className="mt-1 text-sm text-white/70">per pastor</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
            <div className="mt-6 space-y-3">
              <p className="font-bold text-white/90">Included:</p>
              {included.map((item) => (
                <div key={item} className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 size={17} className="shrink-0 text-brand-green" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-1 text-white/80">
              <p className="font-bold text-white">Pay via M-Pesa Paybill</p>
              <p className="ml-2 mt-3 flex items-center gap-3">
                <CheckCircle2 size={17} className="shrink-0 text-brand-green" />
                Paybill No: <span className="font-bold text-white">247247</span>
              </p>
              <p className="ml-2 mt-3 flex items-center gap-3">
                <CheckCircle2 size={17} className="shrink-0 text-brand-green" />
                Business No: <span className="font-bold text-white">144143</span>
              </p>
            </div>
          </div>
        </article>

        <form className="rounded-2xl bg-white p-8 text-stone-900 shadow-2xl" onSubmit={handleSubmit}>
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
              <CheckCircle2 size={48} className="text-brand-red" />
              <h3 className="text-2xl font-extrabold">Registration Received!</h3>
              <p className="text-stone-500">
                Thank you for registering. We will be in touch with confirmation details shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-2 text-sm font-bold text-brand-red underline underline-offset-2 hover:text-brand-dark"
              >
                Register another pastor
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-extrabold">Your Details</h3>
              <p className="mt-1 text-sm text-stone-500">Fill in your information after completing payment.</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-stone-700" htmlFor="reg-name">
                    Full Name
                  </label>
                  <input
                    id="reg-name"
                    name="full_name"
                    type="text"
                    required
                    placeholder="e.g. Pastor John Kamau"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-stone-700" htmlFor="reg-email">
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    placeholder="e.g. pastor@church.org"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-stone-700" htmlFor="reg-mpesa">
                    M-Pesa Transaction Code
                  </label>
                  <input
                    id="reg-mpesa"
                    name="mpesa_transaction_code"
                    type="text"
                    required
                    placeholder="e.g. QJZ8X4K2RT"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm uppercase outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                  />
                  <p className="mt-1.5 text-xs text-stone-400">Enter the M-Pesa code from your payment confirmation SMS.</p>
                </div>
              </div>

              {status === 'error' && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
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
                    Submit Registration <ArrowRight size={18} />
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-xs text-stone-400">
                Churches are encouraged to sponsor their pastors. Spots are limited to 2,000 pastors.
              </p>
            </>
          )}
        </form>
      </div>
      </motion.div>
    </section>
  )
}
