import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { testimonials } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

const TWEEN_FACTOR = 3

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Parallax: track scroll relative to the section entering/leaving the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  // Image moves at 30% of the scroll speed (±15% travel)
  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  // Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' })

  const applyTween = useCallback(() => {
    if (!emblaApi) return
    const progress = emblaApi.scrollProgress()
    const snaps = emblaApi.scrollSnapList()

    emblaApi.slideNodes().forEach((slide, i) => {
      let diff = (snaps[i] ?? 0) - progress
      if (diff > 0.5) diff -= 1
      if (diff < -0.5) diff += 1
      const t = Math.max(0, 1 - Math.abs(diff) * TWEEN_FACTOR)
      slide.style.transform = `scale(${0.82 + 0.18 * t})`
      slide.style.opacity = String(0.45 + 0.55 * t)
    })
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    applyTween()
    onSelect()
    emblaApi.on('scroll', applyTween)
    emblaApi.on('reInit', applyTween)
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('scroll', applyTween)
      emblaApi.off('reInit', applyTween)
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, applyTween, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 text-white">

      {/* Parallax background — 130% tall so it never shows a gap while moving */}
      <motion.img
        src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=2000&q=80"
        alt=""
        aria-hidden="true"
        style={{ y: bgY, top: '-15%', height: '130%' }}
        className="absolute inset-x-0 w-full object-cover"
      />

      <div className="absolute inset-0 bg-[#042a35CC]" />

      <motion.div className="relative px-5 lg:px-8" {...revealProps}>
        <SectionHeading
          eyebrow="Success Stories"
          title="What pastors say after attending."
          light
          strokeWord="Stories"
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((item) => (
                <div
                  key={item.name}
                  className="min-w-0 flex-[0_0_85%] px-3 sm:flex-[0_0_60%] lg:flex-[0_0_44%]"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <blockquote className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
                    <Quote className="pointer-events-none absolute -top-3 right-4 text-brand-red/10" size={96} strokeWidth={1} />
                    <Quote className="relative text-brand-red" size={26} />
                    <p className="relative mt-5 text-lg font-semibold leading-8 text-slate-800">
                      "{item.quote}"
                    </p>
                    <div className="relative mt-6 flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-dark text-sm font-extrabold text-white">
                        {item.name.charAt(0)}
                      </span>
                      <cite className="font-bold not-italic text-slate-800">{item.name}</cite>
                    </div>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 cursor-pointer rounded-full transition-all ${i === selectedIndex ? 'w-6 bg-brand-red' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
