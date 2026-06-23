import { MessageCircle, Users } from 'lucide-react'
import { navItems } from '../data'

export default function Footer() {
  return (
    <footer className="bg-[#111] px-5 py-10 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xl font-extrabold">Shepherds Advance Conference 2026</p>
          <p className="mt-2 text-white/60">Copyright 2026. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-white/75">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white">
              {item}
            </a>
          ))}
        </div>
        <div className="flex gap-3">
          <MessageCircle />
          <Users />
          <a href="#register" className="rounded-full bg-[#F2B21A] px-5 py-2 font-bold text-[#2E1A8C]">
            Register
          </a>
        </div>
      </div>
    </footer>
  )
}
