const cards = [
  ['Vision and purpose', 'To renew pastors and equip churches for Spirit-led leadership and lasting community impact.'],
  ['Who should attend', 'Senior pastors, associate pastors, ministry heads, administrators, youth leaders, and spouses.'],
  ['What you gain', 'Fresh perspective, useful systems, ministry friendships, teaching resources, and renewed conviction.'],
] as const

export default function About() {
  return (
    <section id="about" className="px-5 py-20 lg:px-8 container mx-auto">
      <div className="max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F2B21A]">About the Conference</p>
        <h2 className="mt-3 text-2xl md:text-4xl md:leading-12 font-extrabold text-stone-950">
          A practical space for leaders carrying real ministry responsibility.
        </h2>
      </div>
      {/* <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]"> */}

      <div className="grid gap-5 sm:grid-cols-3 mt-4">
        {cards.map(([title, text], index) => (
          <article key={title} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row text-xl font-bold">
              <h3 >0{index + 1}</h3>
              <h3 className="">{title}</h3></div>

            <p className="mt-3 leading-7 text-stone-600">{text}</p>
          </article>
        ))}
      </div>
      {/* </div> */}
    </section>
  )
}
