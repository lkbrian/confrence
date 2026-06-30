import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import SpeakerCarousel from './SpeakerCarousel'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay },
  }),
}
const fadedown: Variants = {
  hidden: { opacity: 0, y: -25 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay },
  }),
}
const fadeleft: Variants = {
  hidden: { opacity: 0, x: -50 },
  show: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay },
  }),
}

function MeshGrid() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="hero-mesh" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
          <rect width="44" height="44" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="44" y2="44" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <line x1="44" y1="0" x2="0" y2="44" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-mesh)" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[98svh] overflow-hidden bg-brand-dark pt-24 text-white">
      <motion.img
        src="/hero.jpg"
        alt="Conference attendees gathered for a leadership event"
        className="absolute inset-0 h-full w-full object-cover object-bottom"
        initial={{ scale: 1.15, filter: 'blur(24px)', opacity: 0.15 }}
        animate={{ scale: 1, filter: 'blur(0px)', opacity: 0.35 }}
        transition={{ duration: 1.25, ease: [0.25, 0.1, 0.25, 1] as const }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,#111111E0,#042a35CC,#4d9f6c33)]" />

      <motion.div
        className="pointer-events-none absolute inset-y-0 right-0"
        style={{
          width: '45%',
          WebkitMaskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
          maskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
        }}
        initial={{ y: '-60%', opacity: 0, filter: 'blur(20px)' }}
        animate={{ y: '0%', opacity: 0.8, filter: 'blur(0px)' }}
        transition={{ duration: 1.15, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <MeshGrid />
      </motion.div>

      <div className="relative mx-auto grid min-h-[calc(92svh-6rem)] max-w-[1350px] items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">

        {/* Left — text */}
        <div>
          <motion.h1
            className="w-full text-5xl font-extrabold leading-[1.02] lg:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1.15}
          >
            3rd AIC National <span className="playfair-italic">Pastors Conference</span> 2026
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-xl leading-8 text-white/82"
            variants={fadedown}
            initial="hidden"
            animate="show"
            custom={1.25}
          >
            Theme: Trans-Generational Mentorship. A national gathering for pastors across AIC Kenya — pursuing renewal, legacy, and Spirit-led leadership together.
          </motion.p>

          <motion.div
            className="mt-8 grid w-fit gap-5 text-base font-semibold sm:grid-cols-2"
            variants={fadeleft}
            initial="hidden"
            animate="show"
            custom={1.35}
          >
            <span className="flex w-fit items-center gap-3">
              <CalendarDays className="text-brand-green" /> 6th – 8th October 2026
            </span>
            <span className="flex w-fit items-center gap-3">
              <MapPin className="text-brand-green" /> AIC Milimani, Nairobi
            </span>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-row gap-3"
            initial={{ opacity: 0, x: 60, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const, delay: 1.35 }}
          >
            <a
              href="#register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-2 font-bold text-white transition hover:bg-brand-green"
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

        {/* Right — 3D cylinder speaker carousel (lg+ only) */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <SpeakerCarousel />
        </motion.div>

      </div>
    </section>
  )
}
