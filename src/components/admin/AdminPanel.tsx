import type { ReactNode } from 'react'

type AdminPanelProps = { title: string; description?: string; icon?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }

export default function AdminPanel({ title, description, icon, action, children, className = '' }: AdminPanelProps) {
  return (
    <section className={`rounded-2xl border border-stone-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-3 border-b border-stone-100 px-5 py-4">
        <div className="flex items-start gap-3">
          {icon && <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-cream text-brand-red">{icon}</span>}
          <div>
            <h2 className="font-bold text-stone-950">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

