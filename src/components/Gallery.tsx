import { gallery } from '../data'
import SectionHeading from './SectionHeading'

export default function Gallery() {
  return (
    <section className="bg-white px-5 py-20 lg:px-8">
      <SectionHeading eyebrow="Gallery" title="Photos from previous conferences and event highlights." />
      <div className="mx-auto max-w-7xl columns-2 gap-4 md:columns-3 lg:columns-4">
        {gallery.map(({ src, tall }, index) => (
          <div key={src} className="mb-4 break-inside-avoid overflow-hidden rounded-lg">
            <img
              src={src}
              alt={`Conference highlight ${index + 1}`}
              className={`w-full object-cover ${tall ? 'h-72' : 'h-48'}`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
