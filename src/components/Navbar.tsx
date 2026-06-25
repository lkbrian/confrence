import { ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { navItems } from '../data'

const OFFSET = 40

function scrollToSection(id: string) {
  if (id === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - OFFSET
  window.scrollTo({ top, behavior: 'smooth' })
}

function navLink(e: React.MouseEvent<HTMLAnchorElement>, id: string, close?: () => void) {
  e.preventDefault()
  close?.()
  scrollToSection(id)
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-green/12 bg-brand-dark/95 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <a
          href="#hero"
          onClick={(e) => navLink(e, 'hero')}
          className="flex items-center bg-white font-bold gap-3 p-1 rounded-md"
        >
          <img className="w-60" src="/aic-logo.png" alt="" />
        </a>
        <div className="hidden items-center gap-6 text-sm text-white/80 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => navLink(e, item.toLowerCase())}
              className="transition hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="#register"
          onClick={(e) => navLink(e, 'register')}
          className="hidden items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green md:inline-flex"
        >
          Register <ArrowRight size={16} />
        </a>
        <button
          className="rounded-full border border-white/20 p-2 md:hidden"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-brand-dark/95 px-5 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => navLink(e, item.toLowerCase(), () => setOpen(false))}
                className="rounded-lg px-3 py-3 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href="#register"
            onClick={(e) => navLink(e, 'register', () => setOpen(false))}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3 font-bold text-white transition hover:bg-brand-green"
          >
            Register <ArrowRight size={16} />
          </a>
        </div>
      )}
    </header>
  )
}
