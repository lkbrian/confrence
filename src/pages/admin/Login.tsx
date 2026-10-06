import { AlertCircle, ArrowLeft, AtSign, CheckCircle2, Info, KeyRound, Loader2, Mail } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { requestCode, useSession, verifyCode } from '@/lib/auth'

const RESEND_SECONDS = 60

const REASON_MESSAGES: Record<string, string> = {
  auth: 'Please sign in to continue.',
  expired: 'Your session has expired, please sign in again.',
  signedout: "You've been signed out.",
}

const inputClass = (invalid: boolean) =>
  `h-11 w-full rounded-full border bg-white pl-10 pr-4 text-sm outline-none transition focus-visible:ring-[3px] disabled:opacity-60 ${invalid ? 'border-brand-red focus-visible:ring-brand-red/20' : 'border-input focus-visible:border-ring focus-visible:ring-ring/30'}`

export default function Login() {
  const { session, loading } = useSession()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = params.get('next')?.startsWith('/admin') ? params.get('next')! : '/admin/dashboard'
  const reason = params.get('reason')

  const [step, setStep] = useState<'email' | 'code'>('email')
  const [emailInput, setEmailInput] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [notice, setNotice] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const emailRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (resendIn <= 0) return
    const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [resendIn])

  useEffect(() => {
    if (step === 'code') codeRef.current?.focus()
  }, [step])

  if (!loading && session && !submitting) return <Navigate to={next} replace />

  function clearMessages() {
    setError('')
    setFieldError('')
    setNotice('')
  }

  async function sendCode(isResend = false) {
    clearMessages()
    setSubmitting(true)
    const result = await requestCode(emailInput)
    setSubmitting(false)
    if (!result.ok) {
      if (result.field && !isResend) {
        setFieldError(result.message)
        emailRef.current?.focus()
      } else {
        setError(result.message)
      }
      return
    }
    setEmail(result.email!)
    setStep('code')
    setCode('')
    setResendIn(RESEND_SECONDS)
    setNotice(isResend ? 'A new code is on its way.' : '')
  }

  async function handleEmail(e: FormEvent) {
    e.preventDefault()
    await sendCode()
  }

  async function handleCode(e: FormEvent) {
    e.preventDefault()
    clearMessages()
    setSubmitting(true)
    const result = await verifyCode(email, code)
    if (result.ok) {
      navigate(next, { replace: true })
      return
    }
    setSubmitting(false)
    if (result.field) setFieldError(result.message)
    else setError(result.message)
    codeRef.current?.select()
  }

  function backToEmail() {
    clearMessages()
    setStep('email')
    setCode('')
    window.setTimeout(() => emailRef.current?.focus(), 0)
  }

  const banner = !error && !notice && step === 'email' && reason ? REASON_MESSAGES[reason] : ''

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto mb-8 block w-fit rounded-md bg-white p-2 shadow-sm">
          <img className="w-56" src="/aic-logo.png" alt="AIC Pastors Conference" />
        </Link>

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="bg-brand-dark px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">Admin · Step {step === 'email' ? 1 : 2} of 2</p>
            <h1 className="mt-1 text-xl font-bold text-white display">{step === 'email' ? 'Sign in to manage the live page' : 'Check your email'}</h1>
          </div>

          <div className="space-y-5 p-6">
            {banner && (
              <div className="flex items-start gap-2 rounded-xl bg-brand-cream px-4 py-3 text-sm text-brand-dark" role="status">
                <Info size={17} className="mt-0.5 shrink-0 text-brand-green" /> {banner}
              </div>
            )}
            {notice && (
              <div className="flex items-start gap-2 rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-dark" role="status">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-green" /> {notice}
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-brand-red/25 bg-brand-red/5 px-4 py-3 text-sm font-medium text-brand-red" role="alert">
                <AlertCircle size={17} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleEmail} noValidate className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-stone-800">Email</label>
                  <div className="relative">
                    <AtSign size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      ref={emailRef}
                      id="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      autoFocus
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value)
                        setFieldError('')
                      }}
                      disabled={submitting}
                      aria-invalid={Boolean(fieldError)}
                      aria-describedby={fieldError ? 'email-error' : 'email-hint'}
                      className={inputClass(Boolean(fieldError))}
                    />
                  </div>
                  {fieldError ? (
                    <p id="email-error" className="mt-1.5 pl-4 text-xs font-medium text-brand-red">{fieldError}</p>
                  ) : (
                    <p id="email-hint" className="mt-1.5 pl-4 text-xs text-stone-500">We'll email you a one-time sign-in code.</p>
                  )}
                </div>
                <Button type="submit" size="lg" disabled={submitting} className="w-full bg-brand-red hover:bg-brand-dark">
                  {submitting ? <><Loader2 className="animate-spin" /> Sending code…</> : <><Mail /> Send code</>}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCode} noValidate className="space-y-5">
                <p className="text-sm leading-6 text-stone-600">
                  We sent a sign-in code to <strong className="text-stone-900">{email}</strong>. It expires shortly, so enter it below.
                </p>
                <div>
                  <label htmlFor="code" className="mb-1.5 block text-sm font-semibold text-stone-800">Verification code</label>
                  <div className="relative">
                    <KeyRound size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      ref={codeRef}
                      id="code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={8}
                      placeholder="••••••"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.replace(/\D/g, ''))
                        setFieldError('')
                      }}
                      disabled={submitting}
                      aria-invalid={Boolean(fieldError)}
                      aria-describedby={fieldError ? 'code-error' : undefined}
                      className={`${inputClass(Boolean(fieldError))} text-lg font-bold tracking-[0.5em]`}
                    />
                  </div>
                  {fieldError && <p id="code-error" className="mt-1.5 pl-4 text-xs font-medium text-brand-red">{fieldError}</p>}
                </div>
                <Button type="submit" size="lg" disabled={submitting} className="w-full bg-brand-red hover:bg-brand-dark">
                  {submitting ? <><Loader2 className="animate-spin" /> Verifying…</> : 'Verify & sign in'}
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <button type="button" onClick={backToEmail} disabled={submitting} className="text-stone-600 transition hover:text-brand-red">
                    Use a different email
                  </button>
                  <button
                    type="button"
                    onClick={() => sendCode(true)}
                    disabled={submitting || resendIn > 0}
                    className="font-semibold text-brand-red transition hover:underline disabled:cursor-not-allowed disabled:text-stone-400 disabled:no-underline"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <Link to="/" className="mx-auto mt-6 flex w-fit items-center gap-2 text-sm text-stone-600 transition hover:text-brand-red">
          <ArrowLeft size={15} /> Back to site
        </Link>
      </div>
    </div>
  )
}
