export default function Venue() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B21A]">Venue</p>
          <h2 className="mt-3 text-4xl font-extrabold">Jubilee Convention Centre</h2>
          <p className="mt-4 text-lg leading-8 text-stone-600">
            Waiyaki Way, Nairobi. Main auditorium, breakout rooms, prayer chapel, book tables, and sponsor space.
          </p>
          <p className="mt-4 font-semibold">Parking: Free on-site parking with overflow parking and shuttle support.</p>
        </div>
        <div className="min-h-80 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <iframe
            title="Venue map"
            src="https://www.google.com/maps?q=Nairobi%20Kenya&output=embed"
            className="h-80 w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
