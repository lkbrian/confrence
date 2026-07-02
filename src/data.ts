import type { Speaker, ScheduleDay, Testimonial, Topic, Sponsor } from './lib/types/data'
export type { Speaker, ScheduleDay, Testimonial, Topic, Sponsor }

export const navItems = ['About', 'Speakers', 'Schedule', 'Register', 'Contact']

export const whyAttend = [
  'Personal Renewal',
  'Actionable Strategies',
  'Strategic Partnerships',
  'Cultural Clarity',
  'Peer Mentorship',
]

export const speakers: Speaker[] = [
  {
    name: 'Rev. Abraham Mulwa',
    ministry: 'Presiding Bishop, AIC Kenya',
    bio: 'Leading the Africa Inland Church Kenya with a vision for spiritual renewal, unified leadership, and trans-generational impact across the nation.',
    image: '/speakers/mulwa.png',
    imagePosition: 'top',
  },
  {
    name: 'Kevin Howard',
    ministry: 'Plenary Speaker',
    bio: 'Equipping pastoral leaders in mutual trust, vulnerability, and constructive conflict resolution between generations in ministry.',
    image: '/speakers/howard.jpg',
    imagePosition: 'top',
  },
  {
    name: 'Prof. Frank Njenga',
    ministry: 'Plenary Speaker',
    bio: 'A distinguished psychiatrist addressing the escalating crisis of pastoral burnout and advocating for holistic mentorship that prioritizes emotional wellness.',
    image: '/speakers/njenga.jpg',
    imagePosition: 'top',
  },
  {
    name: 'Daniel Woodring',
    ministry: 'Plenary Speaker',
    bio: 'Exploring authority versus collaboration and frameworks for reverse mentorship — where younger pastors help older leaders navigate digital culture and shifting landscapes.',
    image: '/speakers/wooding.jpg',
    imagePosition: 'top',
  },
  {
    name: 'Pr. Bill Ndindi',
    ministry: 'Plenary Speaker',
    bio: 'Navigating generational clashes in preaching styles, technology usage, and community engagement across Baby Boomer, Gen X, Millennial, and Gen Z pastors.',
    image: '/speakers/bill.jpg',
    imagePosition: 'top',
  },
  {
    name: 'Dr. Garry Dull',
    ministry: 'Pastoral Charge Speaker',
    bio: 'Examining the Mosaic-Joshua and Elijah-Elisha paradigms — biblical models of intentional leadership handoffs and the weight of spiritual inheritance.',
    image: '/speakers/dull.jpg',
    imagePosition: 'top',
  },
  {
    name: 'Bishop Kipsoi',
    ministry: 'Pastoral Charge Speaker',
    bio: 'Analyzing 1 and 2 Timothy to extract timeless principles for training younger, culturally distinct leaders in the Pauline mentorship tradition.',
    image: '/speakers/dkipsoi.jpg',
    imagePosition: 'top',
  },
  {
    name: 'Jeff Colleman',
    ministry: 'Track Facilitator',
    bio: 'Leading the Church-Government Relationship track — equipping pastors to engage civic structures with wisdom, biblical integrity, and prophetic clarity.',
    image: '/speakers/coleman.jpg',
    imagePosition: 'top',
  },
]

export const schedule: ScheduleDay[] = [
  {
    day: 'Day 1',
    date: 'Tuesday, 6th October',
    items: [
      'Registration & Hymn Moment',
      'Host Welcome – Bishop Dr. Stephen Mairori',
      'Devotion & Conference Opening – Rev. Abraham Mulwa',
      'Pastors Conference Testimonials',
      'Plenary 1: Mutual Trust and Vulnerability – Kevin Howard',
      'Panel Interview',
      'Plenary 2: Mental Health and Pastoral Wellness – Prof. Frank Njenga',
      'Pastoral Charge 1: The Mosaic-Joshua Paradigm – Dr. Garry Dull',
    ],
  },
  {
    day: 'Day 2',
    date: 'Wednesday, 7th October',
    items: [
      'Registration & Hymn Moment',
      'Devotions – Prof. Jonathan Mwania, VC Scott Christian University',
      'Plenary 3: Authority vs. Collaboration – Daniel Woodring',
      'Plenary 4: Clashing Ministry Philosophies – Bill Ndindi',
      'Break Away Sessions',
      'Pastoral Charge 2: Pauline Mentorship Models – Bishop Kipsoi',
    ],
  },
  {
    day: 'Day 3',
    date: 'Thursday, 8th October',
    items: [
      'Registration & Hymn Moment',
      'Devotions – Prof. Tim Kiruhi, VC International Leadership University',
      'Plenary 5: Conflict & Culture – Navigating Friction Constructively – Kevin Howard',
      'Plenary 6: Reverse Mentorship in Ministry – Daniel Woodring',
      'Pastoral Charge 3: The Elijah-Elisha Succession – Dr. Garry Dull',
      'Conference Closing, Resolutions & Certification – Rev. Abraham Mulwa',
    ],
  },
]

export const plenaryTopics: Topic[] = [
  {
    code: 'P1',
    topic: 'Mutual Trust and Vulnerability',
    brief: 'Overcoming the fear of judgment so that younger pastors can confess failures to older mentors, and older mentors can share their weaknesses.',
    speaker: 'Kevin Howard',
  },
  {
    code: 'P2',
    topic: 'Mental Health and Pastoral Wellness',
    brief: 'The escalating rate of pastoral burnout among younger clergy is directly linked to the absence of holistic mentorship that models emotional boundaries, indicating that effective pastoral successions must prioritize emotional wellness over administrative competence.',
    speaker: 'Prof. Frank Njenga',
  },
  {
    code: 'P3',
    topic: 'Authority vs. Collaboration',
    brief: 'Exploring how older generations view positional authority versus how younger generations prioritize collaborative, flat leadership structures.',
    speaker: 'Daniel Woodring',
  },
  {
    code: 'P4',
    topic: 'Clashing Ministry Philosophies',
    brief: 'Navigating differences in preaching styles, technology usage, and community engagement between Baby Boomer, Gen X, Millennial, and Gen Z pastors.',
    speaker: 'Pr. Bill Ndindi',
  },
  {
    code: 'P5',
    topic: 'Conflict & Culture – Navigating Friction Constructively',
    brief: 'Develop healthy frameworks for handling internal staff friction and external social pressures.',
    speaker: 'Kevin Howard',
  },
  {
    code: 'P6',
    topic: 'Reverse Mentorship in Ministry',
    brief: 'Frameworks where younger pastors mentor older pastors on shifting cultural landscapes, digital environments, and youth subcultures.',
    speaker: 'Daniel Woodring',
  },
]

export const pastoralChallengeTopics: Topic[] = [
  {
    code: 'Pc1',
    topic: 'The Mosaic-Joshua Paradigm',
    brief: 'Examining biblical models of intentional leadership handoffs and empowerment.',
    speaker: 'Dr. Garry Dull',
  },
  {
    code: 'Pc2',
    topic: 'Pauline Mentorship Models',
    brief: 'Analyzing 1 and 2 Timothy to extract principles for training younger, culturally distinct leaders.',
    speaker: 'Bishop Kipsoi',
  },
  {
    code: 'Pc3',
    topic: 'The Elijah-Elisha Succession',
    brief: 'Studying the psychological dynamics of inheriting double portions of responsibility and spiritual weight.',
    speaker: 'Dr. Garry Dull',
  },
]

export const tracks = [
  'Church-Government Relationship',
  'Youth, Culture and Faith',
  'Technology and Media in Ministry',
  'Preparation for Retirement',
]

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
    quote: 'Meeting pastors from aTrans Kenya reminded me we are not alone in this calling. Truly transformative.',
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
  { src: '/gallery/IMG_6916.jpg', tall: false },
  { src: '/gallery/IMG_7512.jpg', tall: true },
  { src: '/gallery/IMG_8026.jpg', tall: true },
  { src: '/gallery/IMG_8038.jpg', tall: true },
  { src: '/gallery/IMG_8082.jpg', tall: false },
  { src: '/gallery/IMG_8086.jpg', tall: true },
  { src: '/gallery/IMG_8121.jpg', tall: false },
  { src: '/gallery/IMG_8465.jpg', tall: true },
  { src: '/gallery/IMG_8468.jpg', tall: false },
  { src: '/gallery/IMG_8512.jpg', tall: true },
  { src: '/gallery/IMG_8557.jpg', tall: false },
  { src: '/gallery/IMG_8725.jpg', tall: true },
  { src: '/gallery/IMG_9194.jpg', tall: false },
  { src: '/gallery/IMG_9623.jpg', tall: true },
  { src: '/gallery/IMG_7353.jpg', tall: true },
  { src: '/gallery/IMG_7403.jpg', tall: false },
  { src: '/gallery/IMG_7418.jpg', tall: false },
  { src: '/gallery/IMG_7484.jpg', tall: false },
]

export const faqs: [string, string][] = [
  ['Who can attend?', 'Pastors and ministry leaders from AIC Kenya churches are welcome to attend.'],
  ['What is included in the fee?', 'Conference materials, meals during the event, and facilitator costs are all covered.'],
  ['What is NOT included?', 'Accommodation, transport, and personal expenses are not covered. Pastors arrange these independently.'],
  ['How do I pay?', 'Pay via M-Pesa Paybill 247247, Business No. 144143 — or bank transfer to Equity Bank Account 0170287296585 (AIC-K Pastors Conference).'],
  ['Can my church sponsor me?', 'Yes. Local churches are encouraged to sponsor their pastor(s) to attend.'],
]

export const mainSponsor: Sponsor = { name: 'Way of Truth Ministries', image: '/sponsors/main.png' }

export const sponsors: Sponsor[] = [
  { name: 'CIC Group', image: '/sponsors/CIC_Group_Logo.png' },
  { name: 'Chiromo Hospital', image: '/sponsors/Chiromohospitallogo.png' },
  { name: 'Kabarak University', image: '/sponsors/Kabarak_University_logo.png' },
  { name: 'Africa Inland Mission', image: '/sponsors/africainlandmission.png' },
  { name: 'BHB', image: '/sponsors/bhb-logo.jpg' },
  { name: 'Daily Bread', image: '/sponsors/dailybreadlogo.png' },
  { name: 'Kijabe Hospital', image: '/sponsors/kijabe.png' },
  { name: 'Kijabe Printing Press', image: '/sponsors/kijabeprintingpresslogo.png' },
  { name: 'Pioneer', image: '/sponsors/pioneerlogo.png' },
  { name: 'Scott Christian University', image: '/sponsors/scott-christian-logo-full.jpeg' },
  { name: 'Truth FM', image: '/sponsors/truthfmlogo.png' },
]
