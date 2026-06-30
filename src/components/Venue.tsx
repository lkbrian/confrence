import SectionHeading from './SectionHeading'

export default function Venue() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading eyebrow="Venue" title="Africa Inland Church Milimani, Nairobi" align="start" strokeWord="Venue" />
          <p className="mt-4 text-lg leading-8 text-stone-600">
            AIC Milimani, Nairobi. Main auditorium, breakout rooms, and track session spaces for all conference activities.
          </p>
        </div>
        <div className="min-h-80 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <iframe
            title="Venue map"
            src="https://www.google.com/maps?q=AIC+Milimani+Nairobi+Kenya&output=embed"
            className="h-80 w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
