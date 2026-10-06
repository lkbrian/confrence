import { CalendarClock, ExternalLink, LayoutDashboard, Loader2, LogOut, Radio, ShieldCheck, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { signOut, useSession } from '@/lib/auth'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/happening', label: 'Happening Now', icon: Radio },
  { to: '/admin/registrations', label: 'Registrations', icon: Users },
  { to: '/admin/schedules', label: 'Schedules', icon: CalendarClock },
]

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { session } = useSession()
  const [signingOut, setSigningOut] = useState(false)

  if (pathname.startsWith('/admin/login')) {
    return (
      <main className="min-h-screen bg-brand-cream text-stone-900">
        <Outlet />
      </main>
    )
  }

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    setSigningOut(false)
  }

  return (
    <div className="min-h-screen bg-brand-cream text-stone-900">
      <header className="sticky top-0 z-40 h-16 border-b border-brand-green/12 bg-brand-dark text-white">
        <div className="flex h-full items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="flex shrink-0 items-center rounded-md bg-white p-1">
              <img className="w-32 sm:w-44" src="/aic-logo.png" alt="AIC Pastors Conference" />
            </Link>
            <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-green sm:inline-flex">
              <ShieldCheck size={14} /> Admin
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {session && <span className="hidden truncate text-sm text-white/70 md:inline">{session.user.email}</span>}
            <Link to="/happening" target="_blank" className="inline-flex items-center gap-1.5 text-sm text-white/80 transition hover:text-white" aria-label="View live page">
              <ExternalLink size={15} /> <span className="hidden sm:inline">Live page</span>
            </Link>
            {session && (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-sm font-semibold transition hover:bg-white hover:text-brand-dark disabled:opacity-60"
              >
                {signingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Phones and tablets: scrollable tab strip. */}
      <nav aria-label="Admin" className="sticky top-16 z-30 flex gap-1 overflow-x-auto border-b border-stone-200 bg-white px-3 py-2 lg:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${isActive ? 'bg-brand-red text-white' : 'text-stone-700 hover:bg-brand-cream'}`
            }
          >
            <Icon size={15} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="lg:flex">
        {/* Desktop: sidebar. */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-stone-200 bg-white lg:flex">
          <nav aria-label="Admin" className="flex flex-col gap-1 p-3">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-brand-red text-white' : 'text-stone-700 hover:bg-brand-cream'}`
                }
              >
                <Icon size={17} /> {label}
              </NavLink>
            ))}
          </nav>
          <p className="mt-auto p-4 text-xs text-stone-400">AIC Pastors Conference 2026</p>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
