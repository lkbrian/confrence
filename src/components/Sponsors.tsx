import { partners } from '../data'
import SectionHeading from './SectionHeading'

export default function Sponsors() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <SectionHeading eyebrow="Sponsors & Partners" title="Supported by churches, ministries, and organizations." strokeWord="Sponsors" />
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((partner) => (
          <div key={partner} className="rounded-lg border border-stone-200 bg-white p-6 text-center text-lg font-extrabold shadow-sm">
            {partner}
          </div>
        ))}
      </div>
    </section>
  )
}
