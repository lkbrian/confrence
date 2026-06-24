import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { testimonials } from '../data'
import SectionHeading from './SectionHeading'

const INTERVAL_MS = 6000
const PER_PAGE = 2
const PAGE_COUNT = Math.ceil(testimonials.length / PER_PAGE)

export default function Testimonials() {
  const [page, setPage] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      setPage((p) => (p + 1) % PAGE_COUNT)
    }, INTERVAL_MS)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [])

  const goTo = (index: number) => {
    setPage(index)
    startTimer()
  }

  const visible = testimonials.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <section className="relative overflow-hidden py-24 text-white">
      <img
        src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=2000&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#111]/80" />

      <div className="relative px-5 lg:px-8">
        <SectionHeading eyebrow="Success Stories" title="What pastors say after attending." light strokeWord="Stories" />

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-2">
            {visible.map((item) => (
              <blockquote
                key={item.name}
                className="rounded-lg border border-white/20 bg-white p-6 backdrop-blur-sm"
              >
                <Quote className="text-[#F2B21A]" />
                <p className="mt-4 text-xl font-semibold leading-8  text-slate-800">"{item.quote}"</p>
                <cite className="mt-5 block font-bold text-slate-800">{item.name}</cite>
              </blockquote>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => goTo((page - 1 + PAGE_COUNT) % PAGE_COUNT)}
              aria-label="Previous"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: PAGE_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${i === page ? 'w-8 bg-[#F2B21A]' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
              />
            ))}

            <button
              onClick={() => goTo((page + 1) % PAGE_COUNT)}
              aria-label="Next"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
