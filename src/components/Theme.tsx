import { Quote } from 'lucide-react'
import SectionHeading from './SectionHeading'

export default function Theme() {
  return (
    <section id="theme" className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <SectionHeading
          align='start'
          eyebrow="Conference Theme"
          title="Strengthened to Lead, Equipped to Serve"
          text="A call to lead from spiritual depth, build healthy teams, and serve communities with wisdom and courage."
          strokeWord="Theme"
        />
        <blockquote className="rounded-lg bg-brand-dark p-8 text-white shadow-xl">
          <Quote className="mb-6 text-brand-green" size={38} />
          <p className="playfair-italic text-2xl font-bold leading-10">
            "Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go."
          </p>
          <cite className="mt-6 block font-semibold text-brand-cream">Joshua 1:9</cite>
        </blockquote>
      </div>
    </section>
  )
}
