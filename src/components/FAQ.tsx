import { motion } from 'framer-motion'
import { faqs } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

export default function FAQ() {
  return (
    <motion.section className="bg-brand-dark px-5 py-20 text-white lg:px-8" {...revealProps}>
      <SectionHeading eyebrow="FAQ" title="Common registration and attendance questions." light strokeWord="FAQ" />
      <div className="mx-auto grid max-w-5xl gap-4">
        {faqs.map(([question, answer]) => (
          <details key={question} className="rounded-lg bg-white/10 p-5">
            <summary className="cursor-pointer text-lg font-bold">{question}</summary>
            <p className="mt-3 leading-7 text-white/75">{answer}</p>
          </details>
        ))}
      </div>
    </motion.section>
  )
}
