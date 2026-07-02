import { Flame, Handshake, Lightbulb, Telescope, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

const items = [
  { icon: Flame, label: 'Personal Renewal' },
  { icon: Lightbulb, label: 'Actionable Strategies' },
  { icon: Handshake, label: 'Strategic Partnerships' },
  { icon: Telescope, label: 'Cultural Clarity' },
  { icon: Users, label: 'Peer Mentorship' },
]

export default function WhyAttend() {
  return (
    <motion.section className="px-5 py-20 lg:px-8 bg-white" {...revealProps}>
      <SectionHeading eyebrow="Why Attend" title="Built around the work pastors actually carry." strokeWord="Why" />
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <Icon className="shrink-0 text-brand-red" size={20} />
            <h3 className="font-bold">{label}</h3>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
