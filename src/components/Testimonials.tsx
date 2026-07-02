import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'
import { testimonials } from '../data'
import { revealProps } from '../lib/motion'
import SectionHeading from './SectionHeading'

const TWEEN_FACTOR = 3

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

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

  useEffect(() => {
    if (!emblaApi) return
    applyTween()
    emblaApi.on('scroll', applyTween)
    emblaApi.on('reInit', applyTween)
    return () => {
      emblaApi.off('scroll', applyTween)
      emblaApi.off('reInit', applyTween)
    }
  }, [emblaApi, applyTween])

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
          <button
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className="absolute -left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:-left-5 lg:-left-7"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="absolute -right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:-right-5 lg:-right-7"
          >
            <ChevronRight size={20} />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((item) => (
                <div
                  key={item.name}
                  className="min-w-0 flex-[0_0_85%] px-3 sm:flex-[0_0_50%] lg:flex-[0_0_40%]"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <blockquote className="rounded-lg border border-white/20 bg-white p-6 backdrop-blur-sm">
                    <Quote className="text-brand-red" />
                    <p className="mt-4 text-lg font-semibold leading-8 text-slate-800">
                      "{item.quote}"
                    </p>
                    <cite className="mt-5 block font-bold not-italic text-slate-800">{item.name}</cite>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
