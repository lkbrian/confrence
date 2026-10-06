import { categoryMeta } from '../../../lib/happeningMeta'
import type { Announcement } from '../../../lib/types/happening'
import Panel from './Panel'

export default function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null
  return (
    <Panel eyebrow="Announcements" title="Important Information">
      <ul className="space-y-3">
        {announcements.map((a) => {
          const { icon: Icon, label } = categoryMeta[a.category] ?? categoryMeta.general
          return (
            <li key={a.id} className="flex gap-3 rounded-sm bg-brand-cream/60 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-white text-brand-red">
                <Icon size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-green">{label}</p>
                <p className="mt-0.5 font-bold text-stone-900">{a.title}</p>
                {a.body && <p className="mt-1 whitespace-pre-line text-sm leading-6 text-stone-600">{a.body}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
