import { motion } from 'framer-motion'
import { gallery } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

export default function Gallery() {
  return (
    <section className="bg-white px-5 py-20 lg:px-8">
      <motion.div {...revealProps}>
      <SectionHeading align='start' eyebrow="Gallery" title="Photos from previous conferences and event highlights." strokeWord="Gallery" />
      <div className="mx-auto columns-2 gap-4 md:columns-3 lg:columns-4">
        {gallery.map(({ src, tall }, index) => (
          <div key={src} className="mb-4 break-inside-avoid overflow-hidden">
            <img
              src={src}
              alt={`Conference highlight ${index + 1}`}
              className={`w-full object-cover ${tall ? 'h-112' : 'h-75'}`}
            />
          </div>
        ))}
      </div>
      </motion.div>
    </section>
  )
}
