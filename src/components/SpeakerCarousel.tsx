import { useKeenSlider, type KeenSliderPlugin } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { speakers } from '../data'

const SLIDE_W = 240   // px — face width of each card
const SLIDE_H = 360   // px — card height
const Z = 310         // cylinder radius (≈ SLIDE_W / (2 * tan(π/n)) for n=8)
const N = speakers.length
const DEG = 360 / N   // degrees between each slide

const carousel: KeenSliderPlugin = (slider) => {
  function rotate() {
    const progress = slider.track.details.progress
    const deg = 360 * progress

    // Spin the whole cylinder
    slider.container.style.transform = `translateZ(-${Z}px) rotateY(${-deg}deg)`
    const currentDeg = ((deg % 360) + 360) % 360
    // Opacity: front face = 1.0, opposite = 0.25
    slider.slides.forEach((slide, i) => {
      const faceDeg = DEG * i

      let diff = Math.abs(faceDeg - currentDeg)
      if (diff > 180) diff = 360 - diff          // take the shorter arc
      const opacity = Math.max(0.25, 1 - (diff / 180) * 0.75)
      slide.style.opacity = String(opacity)
      // Subtle brightness boost for the active face
      slide.style.filter = diff < 30 ? 'brightness(1.08)' : 'brightness(1)'
      // if (opacity === ) { slide.style.scale = String(1.05) } else slide.style.scale = String(0.95)

    })

  }

  slider.on('created', () => {
    // Position each card around the cylinder
    slider.slides.forEach((el, i) => {
      el.style.transform = `rotateY(${DEG * i}deg) translateZ(${Z}px)`
    })
    rotate()
  })
  slider.on('detailsChanged', rotate)
}

const autoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>
  let paused = false

  function next() {
    clearTimeout(timeout)
    if (!paused) timeout = setTimeout(() => slider.next(), 5500)
  }

  slider.on('created', () => {
    // Pause on the perspective wrapper (parent of the carousel container)
    const wrapper = slider.container.parentElement
    wrapper?.addEventListener('mouseenter', () => { paused = true; clearTimeout(timeout) })
    wrapper?.addEventListener('mouseleave', () => { paused = false; next() })
    next()
  })
  slider.on('dragStarted', () => { paused = true; clearTimeout(timeout) })
  slider.on('dragEnded', () => { paused = false; next() })
  slider.on('animationEnded', next)
}

export default function SpeakerCarousel() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      selector: '.carousel__cell',
      renderMode: 'custom',
      mode: 'free-snap',
    },
    [carousel, autoplay],
  )

  return (
    <div>
      <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.18em] text-white/45">
        Featured Speakers
      </p>

      {/* Perspective viewport */}
      <div
        className="flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1100px', height: `${SLIDE_H + 40}px` }}
      >
        {/* Cylinder — this element gets the rotateY transform */}
        <div
          ref={sliderRef}
          className="keen-slider "
          style={{
            width: `${SLIDE_W}px`,
            height: `${SLIDE_H}px`,
            position: 'relative',
            transformStyle: 'preserve-3d',
            overflow: 'visible',   // override keen-slider's overflow:hidden
          }}
        >
          {speakers.map((s) => (
            <div
              key={s.name}
              className="carousel__cell absolute inset-0 overflow-hidden rounded-2xl 2xl:scale-105"
            >
              <img
                src={s.image}
                alt={s.name}
                className="h-full w-full object-cover"
                style={{ objectPosition: s.imagePosition ?? 'center' }}
                draggable={false}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 w-full p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-green">
                  {s.ministry}
                </p>
                <h3 className="mt-1 text-xl font-extrabold leading-tight text-white">
                  {s.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
