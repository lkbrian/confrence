import { ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { navItems } from '../data'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-[#111]/80 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#hero" className="flex items-center font-bold gap-3">
          <img className="w-14" src="/logo.png" alt="" />
          <p className='font-semibold text-xl'>Pastors Confrence</p>
        </a>
        <div className="hidden items-center gap-6 text-sm text-white/80 md:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-white">
              {item}
            </a>
          ))}
        </div>
        <a
          href="#register"
          className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-200 md:inline-flex"
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
        <div className="border-t border-white/10 bg-[#111]/95 px-5 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href="#register"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F2B21A] px-5 py-3 font-bold text-[#2E1A8C] transition hover:bg-[#F6C62B]"
          >
            Register <ArrowRight size={16} />
          </a>
        </div>
      )}
    </header>
  )
}
