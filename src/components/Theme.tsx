import { Quote } from 'lucide-react'
import SectionHeading from './SectionHeading'

export default function Theme() {
  return (
    <section id="theme" className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <SectionHeading
          align='start'
          eyebrow="Conference Theme"
          title="Trans-Generational Mentorship"
          text="A call to bridge the experience gap, ensure leadership continuity, and foster mutual accountability between generations of pastors."
          strokeWord="Theme"
        />
        <blockquote className="rounded-lg bg-brand-dark p-8 text-white shadow-xl">
          <Quote className="mb-6 text-brand-green" size={38} />
          <p className="outfit-italic text-xl  leading-10">
            "We will not hide them from their descendants; we will tell the next generation the praiseworthy deeds of the Lord, his power, and the wonders he has done."
          </p>
          <cite className="mt-6 block playfair-italic text-xl font-semibold text-brand-cream">Psalm 78:4-7</cite>
        </blockquote>
      </div>
    </section>
  )
}
