import type { ReactNode } from 'react'

type PanelProps = { eyebrow?: string; title: string; action?: ReactNode; children: ReactNode; className?: string; id?: string }

export default function Panel({ eyebrow, title, action, children, className = '', id }: PanelProps) {
  return (
    <section id={id} className={`flex scroll-mt-24 flex-col rounded-sm border border-stone-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">{eyebrow}</p>}
          <h2 className="mt-1 text-xl font-extrabold text-stone-950">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
