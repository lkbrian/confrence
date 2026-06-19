import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Church,
  Clock3,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Mic2,
  Phone,
  Quote,
  Sparkles,
  Users,
} from 'lucide-react'

const navItems = ['About', 'Theme', 'Speakers', 'Schedule', 'Register', 'Contact']

const whyAttend = [
  'Leadership development',
  'Ministry growth',
  'Networking with other pastors',
  'Spiritual renewal',
  'Cross-generational mentorship',
]

const speakers = [
  {
    name: 'Bishop Daniel Mwangi',
    ministry: 'Kingdom Life Chapel',
    bio: 'A pastoral leadership mentor focused on church health, prayer culture, and sustainable ministry teams.',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Pastor Miriam Adeyemi',
    ministry: 'Grace City Church',
    bio: 'A discipleship strategist helping churches build strong families, leaders, and next-generation ministries.',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Rev. Caleb Otieno',
    ministry: 'Harvest Mission Network',
    bio: 'An evangelism trainer equipping pastors to mobilize churches for mission, outreach, and community impact.',
    image:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=900&q=80',
  },
]

const schedule = [
  {
    day: 'Day 1',
    date: 'Monday, 6th October',
    items: ['Opening worship and prayer', 'Keynote: Cross-generational mentorship', 'Pastors roundtable dinner'],
  },
  {
    day: 'Day 2',
    date: 'Tuesday, 7th October',
    items: ['Morning devotion', 'Leadership and ministry growth sessions', 'Workshop blocks and networking'],
  },
  {
    day: 'Day 3',
    date: 'Wednesday, 8th October',
    items: ['Prayer summit', 'Generational legacy sessions', 'Commissioning service'],
  },
]

const tracks = [
  'Church Leadership',
  'Evangelism & Discipleship',
  'Youth & Family Ministry',
  'Church Administration',
  'Technology & Media Ministry',
]

const testimonials = [
  {
    quote: 'The sessions gave our leadership team language, courage, and practical steps for the next season.',
    name: 'Pastor James K.',
  },
  {
    quote: 'I returned to my church renewed, connected, and ready to disciple leaders with better structure.',
    name: 'Rev. Angela M.',
  },
]

const gallery = [
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=900&q=80',
]

const faqs = [
  ['Who can attend?', 'Pastors and ministry leaders from AIC Kenya churches are welcome to attend.'],
  ['What is included in the fee?', 'Conference materials, meals during the event, and facilitator costs are all covered.'],
  ['What is NOT included?', 'Accommodation, transport, and personal expenses are not covered. Pastors arrange these independently.'],
  ['How do I pay?', 'Pay via M-Pesa Paybill 247247, Business No. 144143 — or bank transfer to Equity Bank Account 0170287296585 (AIC-K Pastors Conference).'],
  ['Can my church sponsor me?', 'Yes. Local churches are encouraged to sponsor their pastor(s) to attend.'],
]

type SectionHeadingProps = {
  eyebrow: string
  title: string
  text?: string
  light?: boolean
}

function SectionHeading({ eyebrow, title, text, light = false }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-extrabold sm:text-4xl ${light ? 'text-white' : 'text-stone-950'}`}>
        {title}
      </h2>
      {text ? <p className={`mt-4 text-lg leading-8 ${light ? 'text-white/72' : 'text-stone-600'}`}>{text}</p> : null}
    </div>
  )
}

function App() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-stone-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-stone-950/80 text-white backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#hero" className="flex items-center gap-3 font-bold">
            <span className="flex size-10 items-center justify-center rounded-full bg-red-700">
              <Church size={20} />
            </span>
            Pastors Summit
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-white/80 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-white">
                {item}
              </a>
            ))}
          </div>
          <a
            href="#register"
            className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-stone-950 transition hover:bg-amber-200 lg:inline-flex"
          >
            Register <ArrowRight size={16} />
          </a>
          <button className="rounded-full border border-white/20 p-2 lg:hidden" aria-label="Open navigation">
            <Menu size={20} />
          </button>
        </nav>
      </header>

      <section id="hero" className="relative min-h-[92svh] overflow-hidden bg-stone-950 pt-24 text-white">
        <img
          src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=2200&q=80"
          alt="Conference attendees gathered for a leadership event"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,9,0.94),rgba(12,10,9,0.58),rgba(127,29,29,0.46))]" />
        <div className="relative mx-auto grid min-h-[calc(92svh-6rem)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles size={16} /> Pastors & Ministry Leaders Conference
            </p>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
              3rd AIC National Pastors' Conference 2026
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-white/82">
              Theme: Cross-Generational Mentorship. A national gathering for pastors across AIC Kenya — pursuing renewal, legacy, and Spirit-led leadership together.
            </p>
            <div className="mt-8 grid gap-4 text-base font-semibold sm:grid-cols-2">
              <span className="flex items-center gap-3">
                <CalendarDays className="text-amber-300" /> 6th – 8th October 2026
              </span>
              <span className="flex items-center gap-3">
                <MapPin className="text-amber-300" /> AIC Milimani, Nairobi
              </span>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-700 px-7 py-4 font-bold text-white transition hover:bg-red-800"
              >
                Register Now <ArrowRight size={18} />
              </a>
              <a
                href="#schedule"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"
              >
                View Schedule
              </a>
            </div>
          </div>
          <div className="grid gap-4 rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            {['Visionary leadership', 'Healthy churches', 'Renewed pastors'].map((item) => (
              <div key={item} className="flex items-center gap-4 rounded-md bg-white/10 p-4">
                <CheckCircle2 className="shrink-0 text-amber-300" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-800">About the Conference</p>
            <h2 className="mt-3 text-4xl font-extrabold text-stone-950">A practical space for leaders carrying real ministry responsibility.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              ['Vision and purpose', 'To renew pastors and equip churches for Spirit-led leadership and lasting community impact.'],
              ['Who should attend', 'Senior pastors, associate pastors, ministry heads, administrators, youth leaders, and spouses.'],
              ['What you gain', 'Fresh perspective, useful systems, ministry friendships, teaching resources, and renewed conviction.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="theme" className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Conference Theme"
            title="Strengthened to Lead, Equipped to Serve"
            text="A call to lead from spiritual depth, build healthy teams, and serve communities with wisdom and courage."
          />
          <blockquote className="rounded-lg bg-stone-950 p-8 text-white shadow-xl">
            <Quote className="mb-6 text-amber-300" size={38} />
            <p className="text-2xl font-bold leading-10">
              "Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go."
            </p>
            <cite className="mt-6 block font-semibold text-amber-200">Joshua 1:9</cite>
          </blockquote>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="Why Attend" title="Built around the work pastors actually carry." />
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {whyAttend.map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <HeartHandshake className="mb-4 text-red-800" />
              <h3 className="font-bold">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="speakers" className="bg-stone-950 px-5 py-20 text-white lg:px-8">
        <SectionHeading eyebrow="Featured Speakers" title="Experienced voices for pastoral formation." light />
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {speakers.map((speaker) => (
            <article key={speaker.name} className="overflow-hidden rounded-lg bg-white text-stone-900">
              <img src={speaker.image} alt={speaker.name} className="h-72 w-full object-cover" />
              <div className="p-6">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-800">{speaker.ministry}</p>
                <h3 className="mt-2 text-2xl font-extrabold">{speaker.name}</h3>
                <p className="mt-3 leading-7 text-stone-600">{speaker.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="schedule" className="px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="Conference Schedule" title="Three days of worship, teaching, workshops, and prayer." />
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {schedule.map((day) => (
            <article key={day.day} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <p className="flex items-center gap-2 font-bold text-red-800">
                <Clock3 size={18} /> {day.date}
              </p>
              <h3 className="mt-3 text-3xl font-extrabold">{day.day}</h3>
              <ul className="mt-5 space-y-3 text-stone-600">
                {day.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-red-700" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="Session Topics" title="Tracks for every major area of church leadership." />
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tracks.map((track) => (
            <div key={track} className="rounded-lg bg-[#f7f4ee] p-5">
              <Mic2 className="mb-5 text-red-800" />
              <h3 className="font-extrabold">{track}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-800">Venue</p>
            <h2 className="mt-3 text-4xl font-extrabold">Jubilee Convention Centre</h2>
            <p className="mt-4 text-lg leading-8 text-stone-600">
              Waiyaki Way, Nairobi. Main auditorium, breakout rooms, prayer chapel, book tables, and sponsor space.
            </p>
            <p className="mt-4 font-semibold">Parking: Free on-site parking with overflow parking and shuttle support.</p>
          </div>
          <div className="min-h-80 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <iframe
              title="Venue map"
              src="https://www.google.com/maps?q=Nairobi%20Kenya&output=embed"
              className="h-80 w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="register" className="bg-red-900 px-5 py-20 text-white lg:px-8">
        <SectionHeading eyebrow="Registration" title="Register for the Conference" light />
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.4fr]">
          {/* Pricing card */}
          <article className="rounded-2xl bg-white/10 border border-white/20 p-8 text-white self-start">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Conference Fee</p>
            <p className="mt-4 text-6xl font-extrabold">KSh 4,500</p>
            <p className="mt-1 text-white/70 text-sm">per pastor</p>
            <div className="mt-6 space-y-3">
              <p className="font-bold text-white/90">Included:</p>
              {['Conference materials', 'Meals during the event', 'Facilitator costs'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 size={17} className="shrink-0 text-amber-300" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              <p className="font-bold text-white/90">Not included:</p>
              {['Accommodation', 'Transport', 'Personal expenses'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-white/60">
                  <span className="shrink-0 size-4.25 flex items-center justify-center rounded-full border border-white/30 text-xs">✕</span>
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl bg-white/10 border border-white/20 p-4 text-sm space-y-1 text-white/80">
              <p className="font-bold text-white">Pay via M-Pesa Paybill</p>
              <p>Paybill No: <span className="font-bold text-white">247247</span></p>
              <p>Business No: <span className="font-bold text-white">144143</span></p>
              <p className="mt-3 font-bold text-white">Bank Transfer</p>
              <p>Equity Bank – Community Branch</p>
              <p>A/C: <span className="font-bold text-white">0170287296585</span></p>
              <p>Name: AIC-K Pastors Conference</p>
            </div>
          </article>

          {/* Registration form */}
          <form
            className="rounded-2xl bg-white p-8 text-stone-900 shadow-2xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="text-2xl font-extrabold">Your Details</h3>
            <p className="mt-1 text-stone-500 text-sm">Fill in your information after completing payment.</p>
            <div className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5" htmlFor="reg-name">
                  Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="e.g. Pastor John Kamau"
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5" htmlFor="reg-email">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="e.g. pastor@church.org"
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5" htmlFor="reg-mpesa">
                  M-Pesa Transaction Code
                </label>
                <input
                  id="reg-mpesa"
                  type="text"
                  required
                  placeholder="e.g. QJZ8X4K2RT"
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-mono uppercase outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 transition"
                />
                <p className="mt-1.5 text-xs text-stone-400">Enter the M-Pesa code from your payment confirmation SMS.</p>
              </div>
            </div>
            <button
              type="submit"
              className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-full bg-red-700 px-7 py-4 font-bold text-white transition hover:bg-red-800"
            >
              Submit Registration <ArrowRight size={18} />
            </button>
            <p className="mt-4 text-center text-xs text-stone-400">
              Churches are encouraged to sponsor their pastors. Spots are limited to 2,000 pastors.
            </p>
          </form>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="Testimonials" title="Past attendee experiences and success stories." />
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <Quote className="text-red-800" />
              <p className="mt-4 text-xl font-semibold leading-8">"{item.quote}"</p>
              <cite className="mt-5 block font-bold text-stone-600">{item.name}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="Gallery" title="Photos from previous conferences and event highlights." />
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {gallery.map((image, index) => (
            <img key={image} src={image} alt={`Conference highlight ${index + 1}`} className="h-72 w-full rounded-lg object-cover" />
          ))}
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="Sponsors & Partners" title="Supported by churches, ministries, and organizations." />
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Kingdom Life Network', 'Grace City Churches', 'Harvest Missions', 'Media for Ministry'].map((partner) => (
            <div key={partner} className="rounded-lg border border-stone-200 bg-white p-6 text-center text-lg font-extrabold shadow-sm">
              {partner}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-950 px-5 py-20 text-white lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Common registration and attendance questions." light />
        <div className="mx-auto grid max-w-5xl gap-4">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-lg bg-white/10 p-5">
              <summary className="cursor-pointer text-lg font-bold">{question}</summary>
              <p className="mt-3 leading-7 text-white/75">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="Contact" title="Talk to the conference team." />
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            [Mail, 'Email', 'info@pastorssummit.org'],
            [Phone, 'Phone', '+254 700 000 000'],
            [MessageCircle, 'WhatsApp', '+254 711 000 000'],
            [Users, 'Social', '@pastorssummit'],
          ].map(([Icon, label, value]) => (
            <div key={label as string} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <Icon className="text-red-800" />
              <h3 className="mt-4 font-extrabold">{label as string}</h3>
              <p className="mt-2 text-stone-600">{value as string}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-stone-950 px-5 py-10 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-extrabold">Shepherds Advance Conference 2026</p>
            <p className="mt-2 text-white/60">Copyright 2026. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-white/75">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white">
                {item}
              </a>
            ))}
          </div>
          <div className="flex gap-3">
            <MessageCircle />
            <Users />
            <a href="#register" className="rounded-full bg-red-700 px-5 py-2 font-bold text-white">
              Register
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
