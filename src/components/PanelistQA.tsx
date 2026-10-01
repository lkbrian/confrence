import { motion } from 'framer-motion'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

const panelists = [
  'Rev. Dr. Matthews Mwalwa',
  'Bishop Paul Kiprono Raimoi',
  'Rev. John Kalovoto',
  'Rev. Peter Orowe',
  'Pr. Elizabeth Katoo',
]

const discussants = [
  'Bishop Joshua Kimuyu',
  'Prof. Agnes Makau',
  'Bishop Geoffrey Gichure',
  'Bishop Adera Simeon',
]

export default function PanelistQA() {
  return (
    <section id="panelist-qa" className="bg-white px-5 py-20 lg:px-8">
      <motion.div {...revealProps} className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Panelist & Q&A"
          title="Conversations | Reflection| Guidance."
          strokeWord="Panelist"
        />

        {/* Facilitator */}
        <div className="mt-12 flex justify-center">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-red">
              Facilitator
            </p>
            <h3 className="-mt-1 text-2xl font-extrabold text-stone-900">
              Rev. John Kitala
            </h3>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-auto mt-2 h-px max-w-md bg-stone-200" />

        {/* Panel + Q&A */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Panelists */}
          <article className=" px-2 mt-2 py-2 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-red">
              Panelists
            </p>

            <h3 className="-mt-1 text-2xl font-extrabold text-stone-900">
              Panel Interview
            </h3>

            <ul className="mt-4 gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2">
              {panelists.map((name) => (
                <li
                  key={name}
                  className="flex items-start gap-3 text-base leading-7 text-stone-600"
                >
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Discussants */}
          <article className="px-2 mt-2 py-2 sm:px-8 lg:text-right lg:border-l lg:border-stone-200">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-red">
              Discussants
            </p>

            <h3 className="-mt-1 text-2xl font-extrabold text-stone-900">

              Q &amp; A Discussants
            </h3>

            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2 lg:place-items-end">
              {discussants.map((name) => (
                <li
                  key={name}
                  className="flex items-start gap-3 text-base leading-7 text-stone-600"
                >
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </motion.div>
    </section>
  )
}
