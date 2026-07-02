import { User } from 'lucide-react'
import { motion } from 'framer-motion'
import { committee } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'
import type { CommitteeMember } from '../data'

const leadership = committee.filter((m) => m.title === 'Chairman' || m.title === 'Vice Chairman')
const rest = committee.filter((m) => m.title !== 'Chairman' && m.title !== 'Vice Chairman')

function MemberCard({ member, large = false }: { member: CommitteeMember; large?: boolean }) {
  const sizeClasses = `h-50 w-50 rounded-full shadow-lg ${large ? 'sm:h-58 sm:w-58 lg:h-64 lg:w-64' : ''}`
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {member.image ? (
        <img
          src={member.image}
          alt={member.name}
          className={`${sizeClasses} border-4 border-white/15 object-cover object-top ring-1 ring-white/10`}
        />
      ) : (
        <div className={`${sizeClasses} grid place-items-center border-4 border-white/15 bg-white/10 ring-1 ring-white/10`}>
          <User className="h-1/2 w-1/2 text-white/40" strokeWidth={1.5} />
        </div>
      )}
      <div>
        <h3 className={`font-extrabold text-white ${large ? 'text-xl' : 'text-base'}`}>{member.name}</h3>
        <span className="mt-2 inline-block rounded-full bg-brand-red px-3 py-1 text-xs uppercase tracking-[0.14em] text-white">
          {member.title}
        </span>
      </div>
    </div>
  )
}

export default function Committee() {
  return (
    <section id="committee" className="bg-brand-dark px-5 py-20 text-white lg:px-8">
      <motion.div {...revealProps}>
        <SectionHeading
          eyebrow="Organising Committee"
          title="The team planning this year's conference."
          strokeWord="Committee"
          light
        />
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-14 grid max-w-2xl gap-10 sm:grid-cols-2">
            {leadership.map((member) => (
              <MemberCard key={member.name} member={member} large />
            ))}
          </div>
          <div className="relative mx-auto max-w-4xl lg:max-w-6xl before:absolute before:-top-7 before:left-1/2 before:h-px before:w-16 before:-translate-x-1/2 before:bg-white/15">
            <div className="grid gap-6 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
