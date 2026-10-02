import { ArrowRight, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navItems } from '../data'
import NavigationDrawer from './NavigationDrawer'


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
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const sectionIds = ['hero', ...navItems.map((item) => item.toLowerCase())]
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 20)

      const currentSection = sectionIds
        .map((id) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top }))
        .filter((section): section is { id: string; top: number } => section.top !== undefined && section.top <= 140)
        .at(-1)

      setActiveSection(currentSection?.id ?? 'hero')
    }
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${isScrolled ? 'border-stone-200 bg-white text-brand-dark shadow-sm' : 'border-transparent bg-transparent text-white'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <a
          href="#hero"
          onClick={(e) => navLink(e, 'hero')}
          className="flex items-center bg-white font-bold gap-3 p-1 px-3 rounded-xs"
        >
          <img className="w-60" src="/aic-logo.png" alt="" />
        </a>
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="navigation-drawer"
            onClick={() => setOpen((previous) => !previous)}
            className={`inline-flex items-center gap-2 bg-transparent cursor-pointer px-2 py-2 text-sm font-semibold transition-colors ${isScrolled ? 'text-brand-dark hover:text-brand-red' : 'text-white hover:text-white/75'}`}
          >
            <Menu size={16} />
            <span className="text-lg font-semibold">MENU</span>
          </button>
          <a
            href="#register"
            onClick={(e) => navLink(e, 'register')}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green sm:px-5"
          >
            REGISTER <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <NavigationDrawer
        isOpen={open}
        isScrolled={isScrolled}
        activeSection={activeSection}
        onClose={() => setOpen(false)}
        onNavigate={scrollToSection}
      />
    </header>
  )
}
