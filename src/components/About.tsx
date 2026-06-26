import SectionHeading from './SectionHeading'

const cards = [
  ['Vision and purpose', 'To renew pastors and equip churches for Spirit-led leadership and lasting community impact.'],
  ['Who should attend', 'Senior pastors, associate pastors, ministry heads, administrators, youth leaders, and spouses.'],
  ['What you gain', 'Fresh perspective, useful systems, ministry friendships, teaching resources, and renewed conviction.'],
] as const

export default function About() {
  return (
    <section id="about" className="px-5 py-20 lg:px-8 container mx-auto">
      <SectionHeading
        eyebrow="About the Conference"
        title="A practical space for leaders carrying real ministry responsibility."
        align="start"
        strokeWord="About"
      />

      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map(([title, text], index) => (
          <article key={title} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row text-xl font-bold">
              <div className="relative">
                <h3 className="absolute -top-6 left-0 text-7xl md:text-8xl font-black text-transparent opacity-30 [-webkit-text-stroke:0.5px_#111] display">
                  0{index + 1}
                </h3>

                <h3 className="relative text-xl font-bold">
                  {title}
                </h3>
              </div>
            </div>

            <p className="mt-3 leading-7 text-stone-600">{text}</p>
          </article>
        ))}
      </div>
      {/* </div> */}
    </section>
  )
}
