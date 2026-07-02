import { motion } from 'framer-motion'
import { speakers } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

export default function Speakers() {
  return (
    <motion.section id="speakers" className="bg-brand-dark px-5 py-20 text-white lg:px-8" {...revealProps}>
      <SectionHeading eyebrow="Featured Speakers" title="Experienced voices for pastoral formation." light strokeWord="Speakers" />
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {speakers.map((speaker) => (
          <article key={speaker.name} className="overflow-hidden rounded-lg bg-white text-stone-900">
            <img
              src={speaker.image}
              alt={speaker.name}
              className="h-96 w-full object-cover"
              style={{ objectPosition: speaker.imagePosition ?? 'center' }}
            />
            <div className="p-2 px-4">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-red">{speaker.ministry}</p>
              <h3 className="mt-1 text-2xl font-extrabold">{speaker.name}</h3>
              {/* <p className="mt-1 leading-7 text-stone-600">{speaker.bio}</p> */}
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  )
}
