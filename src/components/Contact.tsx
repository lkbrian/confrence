import { Mail, MessageCircle, Phone, Users } from 'lucide-react'
import SectionHeading from './SectionHeading'

const contactItems = [
  { Icon: Mail, label: 'Email', value: 'info@pastorssummit.org' },
  { Icon: Phone, label: 'Phone', value: '+254 700 000 000' },
  { Icon: MessageCircle, label: 'WhatsApp', value: '+254 711 000 000' },
  { Icon: Users, label: 'Social', value: '@pastorssummit' },
]

export default function Contact() {
  return (
    <section id="contact" className="px-5 py-20 lg:px-8">
      <SectionHeading eyebrow="Contact" title="Talk to the conference team." strokeWord="Contact" />
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {contactItems.map(({ Icon, label, value }) => (
          <div key={label} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <Icon className="text-[#F2B21A]" />
            <h3 className="mt-4 font-extrabold">{label}</h3>
            <p className="mt-2 text-stone-600">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
