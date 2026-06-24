import { BookOpen, Building2, Monitor, Target, Users } from 'lucide-react'
import SectionHeading from './SectionHeading'

const topics = [
  { icon: Target, label: 'Church Leadership' },
  { icon: BookOpen, label: 'Evangelism & Discipleship' },
  { icon: Users, label: 'Youth & Family Ministry' },
  { icon: Building2, label: 'Church Administration' },
  { icon: Monitor, label: 'Technology & Media Ministry' },
]

export default function Tracks() {
  return (
    <section className="bg-white px-5 py-20 lg:px-8">
      <SectionHeading eyebrow="Session Topics" title="Tracks for every major area of church leadership." strokeWord="Topics" />
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg bg-[#f7f4ee] p-5">
            <Icon className="shrink-0 text-[#F2B21A]" size={20} />
            <h3 className="font-extrabold">{label}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
