import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay },
  }),
}


export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[92svh] overflow-hidden bg-[#111] pt-24 text-white">
      <motion.img
        src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=2200&q=80"
        alt="Conference attendees gathered for a leadership event"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] as const }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(74,28,207,0.88),rgba(61,78,207,0.72),rgba(46,26,140,0.90))]" />

      <div className="relative mx-auto grid min-h-[calc(92svh-6rem)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <motion.h1
            className="w-full text-5xl font-extrabold leading-[1.02] md:max-w-8xl lg:max-w-6xl lg:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
          >
            3rd AIC National Pastors' Conference 2026
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-xl leading-8 text-white/82"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.35}
          >
            Theme: Trans-Generational Mentorship. A national gathering for pastors aTrans AIC Kenya — pursuing renewal, legacy, and Spirit-led leadership together.
          </motion.p>

          <motion.div
            className="mt-8 grid w-fit gap-5 text-base font-semibold sm:grid-cols-2"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.55}
          >
            <span className="flex w-fit items-center gap-3">
              <CalendarDays className="text-[#F6C62B]" /> 6th – 8th October 2026
            </span>
            <span className="flex w-fit items-center gap-3">
              <MapPin className="text-[#F6C62B]" /> AIC Milimani, Nairobi
            </span>
          </motion.div>

          <motion.div
            className="mt-10 flex gap-3 flex-row"
            initial={{ opacity: 0, x: 60, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.8 }}
          >
            <a
              href="#register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F2B21A] px-7 py-2 font-bold text-[#2E1A8C] transition hover:bg-[#F6C62B]"
            >
              Register Now <ArrowRight size={18} />
            </a>
            <a
              href="#schedule"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-2 font-bold text-white transition hover:bg-white/10"
            >
              View Schedule
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
