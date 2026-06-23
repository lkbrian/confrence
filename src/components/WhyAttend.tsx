import { Flame, GitBranch, Sprout, TrendingUp, Users } from 'lucide-react'
import SectionHeading from './SectionHeading'

const items = [
  { icon: TrendingUp, label: 'Leadership development' },
  { icon: Sprout, label: 'Ministry growth' },
  { icon: Users, label: 'Networking with other pastors' },
  { icon: Flame, label: 'Spiritual renewal' },
  { icon: GitBranch, label: 'Cross-generational mentorship' },
]

export default function WhyAttend() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <SectionHeading eyebrow="Why Attend" title="Built around the work pastors actually carry." />
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <Icon className="shrink-0 text-[#F2B21A]" size={20} />
            <h3 className="font-bold">{label}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
