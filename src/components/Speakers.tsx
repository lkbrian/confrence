import { motion } from 'framer-motion'
import { speakers } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'
import type { Speaker } from '../lib/types/data'

const plenarySpeakers = speakers.filter((s) => s.ministry === 'Plenary Speaker')
const breakawaySpeakers = speakers.filter((s) => s.ministry !== 'Plenary Speaker')

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <img
        src={speaker.image}
        alt={speaker.name}
        className="h-60 w-60 rounded-full border-4 bg-[#F8DEC5] border-brand-dark object-cover shadow-lg ring-1 ring-brand-dark"
        style={{ objectPosition: speaker.imagePosition ?? 'center' }}
      />
      <div>
        <h3 className="text-xl font-extrabold text-white">{speaker.name}</h3>
        <span className="mt-2 inline-block rounded-full bg-brand-red px-3 py-1 text-xs uppercase tracking-[0.14em] text-white">
          {speaker.ministry}
        </span>
      </div>
    </div>
  )
}

export default function Speakers() {
  return (
    <section id="speakers" className="bg-brand-dark px-5 py-20 text-white lg:px-8">
      <motion.div {...revealProps}>
        <SectionHeading eyebrow="Plenary Speakers" title="Experienced voices for pastoral formation." light strokeWord="Speakers" />
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 md:grid-cols-4">
          {plenarySpeakers.map((speaker) => (
            <SpeakerCard key={speaker.name} speaker={speaker} />
          ))}
        </div>

        {/* <h3 className="mt-16 text-center text-xl font-extrabold text-white">Host of Other Speakers for Breakaway Sessions</h3> */}
        <div className="mx-auto mt-6 lg:mt-10  grid max-w-5xl gap-10 sm:grid-cols-2 md:grid-cols-3">
          {breakawaySpeakers.map((speaker) => (
            <SpeakerCard key={speaker.name} speaker={speaker} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
