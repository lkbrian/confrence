import { CalendarDays, Mail, MapPin } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { revealProps } from '../lib/motion'

const footerGroups = [
  {
    title: 'Explore',
    links: [
      ['About', 'about'],
      ['Topics', 'topics'],
      ['Speakers', 'speakers'],
      ['Panelist Q&A', 'panelist-qa'],
    ],
  },
  {
    title: 'Conference',
    links: [
      ['Schedule', 'schedule'],
      ['Office', 'office'],
      ['Committee', 'committee'],
      ['Sponsors', 'sponsors'],
    ],
  },
]

const socialPlatforms = [
  ['Facebook', FaFacebookF],
  ['Instagram', FaInstagram],
  ['LinkedIn', FaLinkedinIn],
  ['YouTube', FaYoutube],
] as const

export default function Footer() {
  return (
    <footer className="border-t border-white/15 bg-brand-dark pt-14 text-white">
      <motion.div {...revealProps}>
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] lg:gap-12 lg:px-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img
                src="/aic-logo.png"
                alt="Africa Inland Church Kenya"
                className="hidden w-48 shrink-0 rounded-xs bg-white p-1"
              />
            </div>
            <p className="mt-5 text-3xl font-bold leading-7 relative">3<sup className='font-light text-base absolute'>rd</sup> <span className='ml-4'>AIC National</span></p>
            <p className="mt-1 text-xl instrument-italic leading-7">Pastors Conference 2026</p>
            <p className="mt-3 text-base leading-7 text-white/80">
              AIC pastors gathering for trans-generational mentorship, renewal, and stronger church leadership.
            </p>
            <div className="mt-5 space-y-3 text-sm text-white/75">
              <p className="flex items-center gap-2">
                <CalendarDays size={16} className="shrink-0 text-brand-green" />
                6–8 October 2026
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="shrink-0 text-brand-green" />
                AIC Milimani, Nairobi
              </p>
            </div>
          </div>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-bold">{group.title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {group.links.map(([label, id]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="transition-colors hover:text-brand-green">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Get in touch">
            <h2 className="text-sm font-bold">Get in touch</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href="#contact" className="transition-colors hover:text-brand-green">Contact the team</a>
              </li>
              <li>
                <a href="#register" className="transition-colors hover:text-brand-green">Register for the conference</a>
              </li>
              <li>
                <a href="mailto:Conference@aickenya.org" className="inline-flex items-center gap-2 transition-colors hover:text-brand-green">
                  <Mail size={15} />
                  Conference@aickenya.org
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="bg-brand-red text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p className="text-white/85">© 2026 Africa Inland Church Kenya. All rights reserved.</p>
            <div className="flex items-center gap-3" role="group" aria-label="Social media">
              {socialPlatforms.map(([name, Icon]) => (
                <span key={name} role="img" aria-label={name} title={name} className="grid size-9 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10">
                  <Icon size={17} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
