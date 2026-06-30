import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { partners } from '../data'
import SectionHeading from './SectionHeading'

// Triple the list so there are always enough slides for a seamless loop
const items = [...partners, ...partners, ...partners]

export default function Sponsors() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, align: 'start' },
    [AutoScroll({ speed: 1.8, stopOnInteraction: false, stopOnMouseEnter: true })],
  )

  return (
    <section className="overflow-hidden px-5 py-20 lg:px-8">
      <SectionHeading
        eyebrow="Sponsors & Partners"
        title="Supported by churches, ministries, and organizations."
        strokeWord="Sponsors"
      />
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {items.map((partner, i) => (
              <div key={i} className="flex-none px-2" style={{ width: '220px' }}>
                <div className="rounded-lg border border-stone-200 bg-white px-6 py-5 text-center text-base font-extrabold shadow-sm">
                  {partner}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
