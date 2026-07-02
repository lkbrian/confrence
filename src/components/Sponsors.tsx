import { useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { LayoutGrid, PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { mainSponsor, sponsors } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

// Triple the list so there are always enough slides for a seamless loop
const items = [...sponsors, ...sponsors, ...sponsors]

export default function Sponsors() {
  const [isScrolling, setIsScrolling] = useState(true)
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, align: 'start' },
    [AutoScroll({ speed: 0.6, stopOnInteraction: false, stopOnMouseEnter: true })],
  )

  return (
    <section id="sponsors" className="overflow-hidden bg-white py-20">
      <motion.div {...revealProps}>
      <div className="px-5 lg:px-8">
        <SectionHeading
          eyebrow="Sponsors & Partners"
          title="Supported by churches, ministries, and organizations."
          strokeWord="Sponsors"
        />

        <div className=" mx-auto mb-10 max-w-7xl">
          <div className='mx-auto flex flex-col justify-center items-center w-fit'>
            <img
              src={mainSponsor.image}
              alt={mainSponsor.name}
              className="h-32 w-auto object-cover"
              style={{
                height: 144
              }}
            />
            <p className='text-[#9a0034] mt-2 text-xl font-bold' style={{
              fontFamily: "Playfair Display",
              fontStyle: 'italic'
            }}>Way Of Truth Ministries</p>
          </div>
        </div>

        <div className="mx-auto mb-10 flex max-w-7xl justify-center">
          <button
            type="button"
            onClick={() => setIsScrolling((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-brand-cream px-5 py-2 text-sm font-bold text-brand-dark transition-colors hover:bg-stone-100"
          >
            {isScrolling ? <LayoutGrid size={16} /> : <PlayCircle size={16} />}
            {isScrolling ? 'View all sponsors' : 'Resume auto-scroll'}
          </button>
        </div>
      </div>

      {isScrolling ? (
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex items-center">
            {items.map((sponsor, i) => (
              <div key={i} className="flex h-28 flex-none items-center justify-center px-8" style={{ width: '260px' }}>
                <img
                  src={sponsor.image}
                  alt={sponsor.name}
                  className="max-h-24 w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-5 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="flex h-24 items-center justify-center">
                <img
                  src={sponsor.image}
                  alt={sponsor.name}
                  className="max-h-20 w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      </motion.div>
    </section>
  )
}
