import { User } from 'lucide-react'
import { motion } from 'framer-motion'
import { office } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'
import type { OfficeMember } from '../data'

function MemberCard({ member }: { member: OfficeMember }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {member.image ? (
        <img
          src={member.image}
          alt={member.name}
          className="h-64 w-64 rounded-full border-4 bg-[#F8DEC5] border-brand-dark object-cover object-top shadow-lg ring-1 ring-brand-dark"
        />
      ) : (
        <div className="grid h-50 w-50 place-items-center rounded-full border-4 border-white/15 bg-white/10 shadow-lg ring-1 ring-white/10">
          <User className="h-1/2 w-1/2 text-white/40" strokeWidth={1.5} />
        </div>
      )}
      <div>
        <h3 className="font-extrabold text-white text-base">{member.name}</h3>
        <span className="mt-2 inline-block rounded-full bg-brand-red px-3 py-1 text-xs uppercase tracking-[0.14em] text-white">
          {member.title}
        </span>
      </div>
    </div>
  )
}

export default function Office() {
  return (
    <section id="office" className="bg-brand-dark px-5 py-20 text-white lg:px-8">
      <motion.div {...revealProps}>
        <SectionHeading
          eyebrow="Church Leadership"
          title="The office presiding over this year's conference."
          strokeWord="Office"
          light
        />
        <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-3">
          {office.map((member) => (
            <MemberCard key={member.title} member={member} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
