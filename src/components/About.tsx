import { Compass, Quote, Sparkles, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

const cards = [
  { icon: Compass, title: 'Vision and Purpose', text: 'This conference exists to equip local pastors with practical ministry tools, foster deep spiritual renewal, and align leadership teams to address contemporary societal challenges with unified, strategic action.' },
  { icon: Users, title: 'Who Should Attend', text: 'Bishops, reverends, all local church pastors, associate pastors, chaplains, other church leaders, and administrators.' },
  { icon: Sparkles, title: 'What You Gain', text: 'Personal Renewal, Actionable Strategies, Strategic Partnerships, Cultural Clarity, and Peer Mentorship.' },
] as const

export default function About() {
  return (
    <motion.section id="about" className="px-5 py-20 lg:px-8 bg-white w-full" {...revealProps}>
      <div className="container mx-auto">
        <SectionHeading
          eyebrow="About the Conference"
          title="Equip. Encourage. Align."
          align="start"
          strokeWord="About"
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="relative flex flex-col justify-center gap-6 rounded-2xl p-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">This Year's Theme</p>
              <h3 className="mt-2 text-2xl font-extrabold text-stone-950 sm:text-3xl">Trans-Generational Mentorship</h3>
              <p className="mt-3 leading-7 text-stone-600 text-lg">
                The AIC National Pastors Conference is a practical platform that equips, encourages, and aligns church leaders to strengthen their local and collective impact while bridging the experience gap, ensuring leadership continuity, and fostering mutual accountability across generations of pastors.

              </p>
            </div>

            <blockquote className="rounded-lg ">
              <Quote className="mb-4 text-brand-green" size={30} />
              <p className="outfit-italic text-lg leading-8 text-stone-600">
                "We will not hide them from their descendants; we will tell the next generation
                the praiseworthy deeds of the Lord,  his power, and the wonders he has done.
                He decreed statutes for Jacob and established the law in Israel, which he commanded our ancestors to teach their children, so the next generation would know them, even the children yet to be born, and they in turn would tell their children. Then they would put their trust in God and would not forget his deeds but would keep his commands"
              </p>
              <cite className="mt-2 block playfair-italic text-2xl font-semibold text-brand-red">Psalm 78:4-7</cite>
            </blockquote>
          </div>

          <div className="flex flex-col gap-6">
            {cards.slice(0, 1).map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="relative overflow-visible rounded-lg border z-10 border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="absolute bg-white z-20 -top-4 -right-2 px-2 ">
                  <span className="text-7xl font-black text-transparent opacity-[0.06] [-webkit-text-stroke:1.5px_#042a35] display">01</span>
                </div>

                <div className="relative flex flex-col gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-red/10 text-brand-red">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="leading-7 text-stone-600">{text}</p>
                </div>
              </article>
            ))}

            <div className="grid gap-6 sm:grid-cols-2">
              {cards.slice(1).map(({ icon: Icon, title, text }, index) => (
                <article
                  key={title}
                  className="relative overflow-visible rounded-lg border z-10 border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="absolute bg-white z-20 -top-4 -right-2 px-2 ">
                    <span className="text-7xl font-black text-transparent opacity-[0.06] [-webkit-text-stroke:1.5px_#042a35] display">0{index + 2}</span>
                  </div>

                  <div className="relative flex flex-col gap-2">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-red/10 text-brand-red">
                      <Icon size={20} />
                    </span>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="leading-7 text-stone-600">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
