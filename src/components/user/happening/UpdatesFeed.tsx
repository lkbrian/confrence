import { Radio } from 'lucide-react'
import { updateKindMeta } from '../../../lib/happeningMeta'
import { formatTimeOfDay } from '../../../lib/timeline'
import type { LiveUpdate } from '../../../lib/types/happening'
import Panel from './Panel'

type UpdatesFeedProps = { updates: LiveUpdate[]; onOpenPhoto: (src: string) => void }

export default function UpdatesFeed({ updates, onOpenPhoto }: UpdatesFeedProps) {
  return (
    <Panel eyebrow="Live" title="Conference Updates">
      {updates.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-sm bg-stone-50 px-4 py-10 text-center text-stone-500">
          <Radio size={22} className="text-brand-green" />
          <p className="font-semibold text-stone-700">No updates yet</p>
          <p className="text-sm">Updates will appear here as the day unfolds.</p>
        </div>
      ) : (
        <ol className="relative">
          {updates.map((update, i) => {
            const { icon: Icon, label } = updateKindMeta[update.kind] ?? updateKindMeta.general
            const isLast = i === updates.length - 1
            return (
              <li key={update.id} className="relative flex gap-4 pb-7 last:pb-0">
                {!isLast && <span className="absolute left-4.5 top-10 bottom-0 w-px bg-stone-200" />}
                <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-brand-cream text-brand-red ring-4 ring-white">
                  <Icon size={16} />
                </span>
                <article className="min-w-0 flex-1 pt-0.5">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-green">
                    {formatTimeOfDay(update.created_at)} · <span className="text-stone-400">{label}</span>
                  </p>
                  <h3 className="mt-1 font-bold leading-snug text-stone-900">{update.title}</h3>
                  {update.body && <p className="mt-1 whitespace-pre-line text-stone-600">{update.body}</p>}
                  {update.image_url && (
                    <button type="button" onClick={() => onOpenPhoto(update.image_url!)} className="mt-3 block w-full overflow-hidden rounded-sm">
                      <img src={update.image_url} alt={update.title} loading="lazy" className="max-h-96 w-full object-cover transition duration-300 hover:scale-[1.02]" />
                    </button>
                  )}
                </article>
              </li>
            )
          })}
        </ol>
      )}
    </Panel>
  )
}
