export const navItems = ['About', 'Theme', 'Speakers', 'Schedule', 'Register', 'Contact']

export const whyAttend = [
  'Leadership development',
  'Ministry growth',
  'Networking with other pastors',
  'Spiritual renewal',
  'Cross-generational mentorship',
]

export type Speaker = {
  name: string
  ministry: string
  bio: string
  image: string
}

export const speakers: Speaker[] = [
  {
    name: 'Bishop Daniel Mwangi',
    ministry: 'Kingdom Life Chapel',
    bio: 'A pastoral leadership mentor focused on church health, prayer culture, and sustainable ministry teams.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Pastor Miriam Adeyemi',
    ministry: 'Grace City Church',
    bio: 'A discipleship strategist helping churches build strong families, leaders, and next-generation ministries.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Rev. Caleb Otieno',
    ministry: 'Harvest Mission Network',
    bio: 'An evangelism trainer equipping pastors to mobilize churches for mission, outreach, and community impact.',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=900&q=80',
  },
]

export type ScheduleDay = {
  day: string
  date: string
  items: string[]
}

export const schedule: ScheduleDay[] = [
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

export const tracks = [
  'Church Leadership',
  'Evangelism & Discipleship',
  'Youth & Family Ministry',
  'Church Administration',
  'Technology & Media Ministry',
]

export type Testimonial = {
  quote: string
  name: string
}

export const testimonials: Testimonial[] = [
  {
    quote: 'The sessions gave our leadership team language, courage, and practical steps for the next season.',
    name: 'Pastor James K.',
  },
  {
    quote: 'I returned to my church renewed, connected, and ready to disciple leaders with better structure.',
    name: 'Rev. Angela M.',
  },
  {
    quote: 'Meeting pastors from across Kenya reminded me we are not alone in this calling. Truly transformative.',
    name: 'Bishop Samuel O.',
  },
  {
    quote: 'For the first time in years I felt seen as a pastor, not just a leader. This conference cared for the shepherd.',
    name: 'Pastor Ruth N.',
  },
  {
    quote: 'The intergenerational dialogue opened my eyes. I left with a hunger to build bridges in my own congregation.',
    name: 'Rev. Peter Mabula.',
  },
  {
    quote: 'God used this conference to confirm a vision I had been afraid to pursue. I came back with courage to act.',
    name: 'Pastor Grace Wainaina.',
  },
]

export const gallery = [
  { src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80', tall: false },
  { src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80', tall: true },
  { src: 'https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=900&q=80', tall: false },
  { src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80', tall: true },
  { src: 'https://images.unsplash.com/photo-1459180136908-f0ef55009efc?auto=format&fit=crop&w=900&q=80', tall: false },
  { src: 'src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=2200&q=80', tall: true },
  { src: 'https://images.unsplash.com/photo-1560523159-4a9692d222ef?auto=format&fit=crop&w=900&q=80', tall: false },
  { src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=80', tall: true },
  { src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80', tall: false },
  { src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80', tall: false },
]

export const faqs: [string, string][] = [
  ['Who can attend?', 'Pastors and ministry leaders from AIC Kenya churches are welcome to attend.'],
  ['What is included in the fee?', 'Conference materials, meals during the event, and facilitator costs are all covered.'],
  ['What is NOT included?', 'Accommodation, transport, and personal expenses are not covered. Pastors arrange these independently.'],
  ['How do I pay?', 'Pay via M-Pesa Paybill 247247, Business No. 144143 — or bank transfer to Equity Bank Account 0170287296585 (AIC-K Pastors Conference).'],
  ['Can my church sponsor me?', 'Yes. Local churches are encouraged to sponsor their pastor(s) to attend.'],
]

export const partners = [
  'Kingdom Life Network',
  'Grace City Churches',
  'Harvest Missions',
  'Media for Ministry',
]
