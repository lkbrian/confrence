import { motion } from 'framer-motion'
import { plenaryTopics, pastoralChallengeTopics } from '../data'
import { revealProps } from '../lib/motion'
import type { Topic } from '../lib/types/data'
import SectionHeading from './SectionHeading'

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-red text-sm font-extrabold text-white">
          {topic.code}
        </span>
        <h3 className="font-extrabold leading-snug text-stone-900">{topic.topic}</h3>
      </div>
      <p className="leading-7 text-stone-600">{topic.brief}</p>
      <p className="mt-auto pt-1 text-sm font-bold uppercase tracking-[0.14em] text-brand-green">{topic.speaker}</p>
    </article>
  )
}

export default function Topics() {
  return (
    <motion.section id="topics" className="bg-brand-cream px-5 py-20 lg:px-8" {...revealProps}>
      <SectionHeading
        eyebrow="Trans-Generational Mentorship"
        title="Session topics shaping the conversation."
        strokeWord="Topics"
      />

      <div className="mx-auto max-w-7xl">
        <h3 className="text-xl font-extrabold text-brand-dark">Plenary Sessions</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {plenaryTopics.map((topic) => (
            <TopicCard key={topic.code} topic={topic} />
          ))}
        </div>

        <h3 className="mt-14 text-xl font-extrabold text-brand-dark">Pastoral Challenge Sessions</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pastoralChallengeTopics.map((topic) => (
            <TopicCard key={topic.code} topic={topic} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
