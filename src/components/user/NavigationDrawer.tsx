import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { navItems } from '../../data'

type NavigationDrawerProps = {
  isOpen: boolean
  isScrolled: boolean
  activeSection: string
  onClose: () => void
  onNavigate: (id: string) => void
}

const drawerItems = [{ label: 'Home', id: 'hero' }, ...navItems.map((label) => ({ label, id: label.toLowerCase() }))]

export default function NavigationDrawer({ isOpen, isScrolled, activeSection, onClose, onNavigate }: NavigationDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-[60] transition-[visibility] duration-300 ${isOpen ? 'visible' : 'invisible'}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 h-full w-full bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        id="navigation-drawer"
        aria-label="Main navigation"
        className={`absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col pb-8 pt-5 shadow-2xl transition-transform duration-300 ${isScrolled ? 'bg-white text-brand-dark' : 'bg-brand-dark text-white'} ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-current/15 px-6 pb-5">
          <span className="text-lg font-bold">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-current/10"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 ">
          <Link
            to="/happening"
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-3 text-base font-semibold transition hover:bg-current/10 ${isScrolled ? 'text-brand-dark' : 'text-white'}`}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-red" /> Live updates
          </Link>
          <Link
            to="/next-conference"
            onClick={onClose}
            className={`px-6 py-3 text-base font-semibold transition hover:bg-current/10 ${isScrolled ? 'text-brand-dark' : 'text-white'}`}
          >
            2027 Conference
          </Link>
          {drawerItems.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault()
                onClose()
                onNavigate(id)
              }}
              className={` px-6 py-3 text-base font-medium transition ${activeSection === id ? 'bg-brand-red text-white' : `hover:bg-current/10 ${isScrolled ? 'text-brand-dark' : 'text-white'}`}`}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  )
}