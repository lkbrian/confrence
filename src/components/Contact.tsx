import { House, Mail, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

const contactItems = [
  {
    Icon: House,
    label: 'Visit Us',
    description: 'Find us at AIC Milimani for the 3rd AIC National Pastors Conference, 6–8 October 2026.',
    value: 'AIC Milimani, Nairobi',
    href: 'https://www.google.com/maps?q=AIC+Milimani+Nairobi+Kenya',
  },
  {
    Icon: Phone,
    label: 'Call Us',
    description: 'Call the conference team for help with attendance, registration, or event details.',
    value: '+254 700 000 000',
    href: 'tel:+254700000000',
  },
  {
    Icon: Mail,
    label: 'Contact Us',
    description: 'Email us with questions about the conference, schedule, or registration.',
    value: 'Conference@aickenya.org',
    href: 'mailto:Conference@aickenya.org',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="bg-white px-5 py-20 lg:px-8">
      <motion.div {...revealProps}>
      <SectionHeading eyebrow="Contact" title="Talk to the conference team." strokeWord="Contact" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-stone-200 md:grid-cols-3 md:divide-x md:divide-y-0">
        {contactItems.map(({ Icon, label, description, value, href }) => (
          <a
            key={label}
            href={href}
            target={label === 'Visit Us' ? '_blank' : undefined}
            rel={label === 'Visit Us' ? 'noreferrer' : undefined}
            className="group flex min-h-48 flex-col items-center justify-center px-6 py-8 text-center transition-colors hover:bg-stone-50 md:px-5 lg:px-10"
          >
            <Icon className="mb-5 text-brand-red transition-transform group-hover:-translate-y-1" size={32} strokeWidth={2} />
            <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">{label}</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-stone-500">{description}</p>
            <span className="mt-3 text-sm font-semibold text-brand-red">{value}</span>
          </a>
        ))}
      </div>
      </motion.div>
    </section>
  )
}
