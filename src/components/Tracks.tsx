import { Landmark, Monitor, Sunset, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

const topics = [
  { icon: Landmark, label: 'Church-Government Relationship', facilitator: 'Jeff Colleman' },
  { icon: Users, label: 'Youth, Culture and Faith', facilitator: 'Pr. Bill Ndindi' },
  { icon: Monitor, label: 'Technology and Media in Ministry', facilitator: '' },
  { icon: Sunset, label: 'Preparation for Retirement', facilitator: 'Dr. Garry Dull' },
]

export default function Tracks() {
  return (
    <motion.section className="bg-white px-5 py-20 lg:px-8" {...revealProps}>
      <SectionHeading eyebrow="Conference Tracks" title="Breakaway sessions for every area of pastoral life." strokeWord="Tracks" />
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2">
        {topics.map(({ icon: Icon, label, facilitator }) => (
          <div key={label} className="flex items-start gap-4 rounded-lg bg-brand-cream p-6">
            <Icon className="mt-0.5 shrink-0 text-brand-red" size={22} />
            <div>
              <h3 className="font-extrabold">{label}</h3>
              {facilitator && <p className="mt-1 text-sm text-stone-600">{facilitator}</p>}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
