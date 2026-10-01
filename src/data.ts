import type { Speaker, ScheduleDay, ScheduleItem, Testimonial, Topic, Sponsor, CommitteeMember, OfficeMember } from './lib/types/data'
export type { Speaker, ScheduleDay, ScheduleItem, Testimonial, Topic, Sponsor, CommitteeMember, OfficeMember }

export const navItems = ['About', 'Office', 'Committee', 'Speakers', 'Schedule', 'Sponsors', 'Register', 'Contact']

export const whyAttend = [
  'Personal Renewal',
  'Actionable Strategies',
  'Strategic Partnerships',
  'Cultural Clarity',
  'Peer Mentorship',
]

export const speakers: Speaker[] = [
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
    name: 'Pr. Bill Dindi',
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
    forewordSlug: 'international',
  },
  {
    name: 'Bishop DR David Kipsoi',
    ministry: 'Bishop, Elgeyo Marakwet Area',
    bio: 'Analyzing 1 and 2 Timothy to extract timeless principles for training younger, culturally distinct leaders in the Pauline mentorship tradition.',
    image: '/speakers/dkipsoi.jpg',
    imagePosition: 'top',
  },
  {
    name: 'Jeff Coleman',
    ministry: 'Track Facilitator',
    bio: 'Leading the Church-Government Relationship track — equipping pastors to engage civic structures with wisdom, biblical integrity, and prophetic clarity.',
    image: '/speakers/coleman.jpg',
    imagePosition: 'top',
  },
]

export const schedule: ScheduleDay[] = [
  {
    day: 'Day 1',
    date: 'Tuesday, 6th October 2026',
    isoDate: '2026-10-06',
    items: [
      { time: '0730 - 0850', activity: 'Registration', facilitator: 'Secretariat' },
      { time: '0850 - 0900', activity: 'Hymn Moment', facilitator: 'Pr. Odu' },
      { time: '0900 - 0905', activity: 'Host Welcome', facilitator: 'Bishop Dr. Stephen Mairori' },
      { time: '0905 - 0930', activity: 'Devotion and Conference Opening', facilitator: 'Bishop Abraham Mulwa (Presiding Bishop, AIC Kenya)' },
      { time: '0930 - 1030', activity: 'Plenary 1: Mutual Trust and Vulnerability', facilitator: 'Bishop DR David Kipsoi' },
      { time: '1030 - 1115', activity: 'Morning Tea Break', facilitator: 'Hospitality / Secretariat' },
      { time: '1115 - 1130', activity: 'Hymn Moment / Partners Ads', facilitator: 'Pr. Odu / Media' },
      { time: '1130 - 1215', activity: 'Panel Interview' },
      { time: '1230 - 1300', activity: 'Plenary 2: Mental Health and Pastoral Wellness', facilitator: 'Prof. Frank Njenga' },
      // { time: '1215 - 1300', activity: 'Plenary 2: Mentoring Civility – Relationship between Church and State', facilitator: 'Jeff Coleman' },
      { time: '1300 - 1400', activity: 'Lunch', facilitator: 'Hospitality / Secretariat' },
      { time: '1400 - 1415', activity: 'Hymn Moment / Partners Ads', facilitator: 'Pr. Odu / Media' },
      { time: '1415 - 1545', activity: 'Pastoral Charge 1: The Mosaic-Joshua Paradigm', facilitator: 'Daniel Woodring' },
      { time: '1545 - 1600', activity: 'Conclusions / Announcement / Closing', facilitator: 'Organizing Committee' },
    ],
  },
  {
    day: 'Day 2',
    date: 'Wednesday, 7th October 2026',
    isoDate: '2026-10-07',
    items: [
      { time: '0800 - 0830', activity: 'Registration', facilitator: 'Secretariat' },
      { time: '0830 - 0845', activity: 'Hymn Moment', facilitator: 'Pr. Odu' },
      { time: '0845 - 0900', activity: 'Devotions', facilitator: 'Bishop Dr. Simeon Adera' },
      { time: '0900 - 1000', activity: 'Plenary 3: Authority vs. Collaboration', facilitator: 'Daniel Woodring' },
      // { time: '0900 - 1000', activity: 'Plenary 3: Mental Health and Pastoral Wellness', facilitator: 'Prof. Frank Njenga' },
      { time: '1000 - 1045', activity: 'Morning Tea Break', facilitator: 'Hospitality / Secretariat' },
      { time: '1045 - 1145', activity: 'Plenary 4: Clashing Ministry Philosophies', facilitator: 'Pr. Bill Dindi' },
      { time: '1145 - 1200', activity: 'Hymn Moment / Partners Ads', facilitator: 'Pr. Odu / Media' },
      { time: '1200 - 1300', activity: 'Q & A Session' },
      { time: '1300 - 1400', activity: 'Lunch', facilitator: 'Hospitality / Secretariat' },
      { time: '1400 - 1415', activity: 'Hymn Moment / Partners Ads', facilitator: 'Pr. Odu / Media' },
      { time: '1415 - 1545', activity: 'Pastoral Charge 2: Pauline Mentorship Models', facilitator: 'Kevin Howard' },
      { time: '1545 - 1600', activity: 'Conclusions and Announcement', facilitator: 'Organizing Committee' },
    ],
  },
  {
    day: 'Day 3',
    date: 'Thursday, 8th October 2026',
    isoDate: '2026-10-08',
    items: [
      { time: '0800 - 0830', activity: 'Registration', facilitator: 'Secretariat' },
      { time: '0830 - 0845', activity: 'Hymn Moment / Partners Ads', facilitator: 'Pr. Odu / Media' },
      { time: '0845 - 0900', activity: 'Devotions', facilitator: 'Rev. Peter Ng\'ok' },
      { time: '0900 - 1000', activity: 'Plenary 5: Conflict & Culture – Navigating Friction Constructively', facilitator: 'Kevin Howard' },
      { time: '1000 - 1045', activity: 'Morning Tea Break', facilitator: 'Hospitality / Secretariat' },
      { time: '1045 - 1145', activity: 'Plenary 6: Youth, Culture & Faith', facilitator: 'Pr. Bill Dindi' },
      { time: '1145 - 1150', activity: 'Hymn Moment', facilitator: 'Pr. Odu' },
      { time: '1150 - 1300', activity: 'Pastoral Charge 3: Preparing for Retirement - The Elijah-Elisha Succession', facilitator: 'Rev. Joseph Ndebe Kiiru' },
      { time: '1300 - 1330', activity: 'Conference Closing / Resolutions / Certification', facilitator: 'Organizing Committee / Bishop Abraham Mulwa' },
      { time: '1330 - 1400', activity: 'Lunch / Departure', facilitator: 'Hospitality / Secretariat' },
    ],
  },
]

export const plenaryTopics: Topic[] = [
  {
    code: 'P1',
    topic: 'Mutual Trust and Vulnerability',
    brief: 'Overcoming the fear of judgment so that younger pastors can confess failures to older mentors, and older mentors can share their weaknesses.',
    speaker: 'Bishop DR David Kipsoi',
  },
  {
    code: 'P2',
    topic: 'Authority and Collaboration',
    brief: 'Exploring how older generations view positional authority versus how younger generations prioritize collaborative, flat leadership structures.',
    speaker: 'Daniel Woodring',
  },
  {
    code: 'P3',
    topic: 'Mental Health and Pastoral Wellness',
    brief: 'The escalating rate of pastoral burnout among younger clergy is directly linked to the absence of holistic mentorship that models emotional boundaries, indicating that effective pastoral successions must prioritize emotional wellness over administrative competence.',
    speaker: 'Prof. Frank Njenga',
  },
  // {
  //   code: 'P3',
  //   topic: 'Authority vs. Collaboration',
  //   brief: 'Exploring how older generations view positional authority versus how younger generations prioritize collaborative, flat leadership structures.',
  //   speaker: 'Daniel Woodring',
  // },
  {
    code: 'P4',
    topic: 'Clashing Ministry Philosophies',
    brief: 'Navigating differences in preaching styles, technology usage, and community engagement between Baby Boomer, Gen X, Millennial, and Gen Z pastors.',
    speaker: 'Pr. Bill Dindi',
  },
  {
    code: 'P5',
    topic: 'Conflict & Culture – Navigating Friction Constructively',
    brief: 'Develop healthy frameworks for handling internal staff friction and external social pressures.',
    speaker: 'Kevin Howard',
  },
  {
    code: 'P6',
    topic: 'Youth, Culture & Faith',
    brief: 'Frameworks where younger pastors mentor older pastors on shifting cultural landscapes, digital environments, and youth subcultures.',
    speaker: 'Pr. Bill Dindi',
  },
]

export const pastoralChallengeTopics: Topic[] = [
  {
    code: 'Pc1',
    topic: 'The Mosaic-Joshua Paradigm',
    brief: 'Examining biblical models of intentional leadership handoffs and empowerment.',
    speaker: 'Daniel Woodring',
  },
  {
    code: 'Pc2',
    topic: 'Pauline Mentorship Models',
    brief: 'Analyzing 1 and 2 Timothy to extract principles for training younger, culturally distinct leaders.',
    speaker: 'Kevin Howard',
  },
  {
    code: 'Pc3',
    topic: 'Preparing for Retirement - The Elijah-Elisha Succession',
    brief: 'Studying the psychological dynamics of inheriting double portions of responsibility and spiritual weight.',
    speaker: 'Rev. Joseph Ndebe Kiiru',
  },
]

export const tracks = [
  'Church-Government Relationship',
  'Youth, Culture & Faith',
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

export const office: OfficeMember[] = [
  { name: 'Bishop Abraham Mulwa', title: 'Presiding Bishop, AIC Kenya', image: '/office/mulwa.png', forewordSlug: 'bishops' },
  { name: 'Bishop Paul Kirui', title: 'Deputy Presiding Bishop', image: '/office/kirui.png' },
  { name: 'Bishop Dr. Simeon Adera', title: 'Administrative Secretary, AIC Kenya', image: '/office/simon.jpg' },
]

export const committee: CommitteeMember[] = [
  { name: 'Rev. Dr. Luke Odhiambo', title: 'Chairman', image: '/committee/luke.jpeg', forewordSlug: 'committee' },
  { name: 'Rev. Dr. Sammy Muthini', title: 'Vice Chairman', image: '/committee/Vice-Chairman.png' },
  { name: 'Rev. Stanley Mutangili', title: 'Secretary', image: '/committee/Secretary.png' },
  { name: 'Mr. Paul Mugo', title: 'Finance', image: '/committee/mugo.jpeg' },
  { name: 'Rev. John Kitala', title: 'Member', image: '/committee/kitala.jpeg' },
  { name: 'Rev. Raymond Kyengo', title: 'Member', image: '/committee/raymond.jpeg' },
  { name: 'Pr. Benson Waema', title: 'Member', image: '/committee/waema.jpeg' },
  { name: 'Rev. John Katete', title: 'Member', image: '/committee/Treasurer.png' },
]

export const mainSponsor: Sponsor = { name: 'Way of Truth Ministries', image: '/sponsors/main.png' }

export const sponsors: Sponsor[] = [
  { name: 'CIC Group', image: '/sponsors/CIC_Group_Logo.png' },
  { name: 'Chiromo Hospital', image: '/sponsors/Chiromohospitallogo.png' },
  { name: 'Kabarak University', image: '/sponsors/Kabarak_University_logo.png' },
  { name: 'Africa Inland Mission', image: '/sponsors/africainlandmission.png' },
  { name: 'The International Leadership University', image: '/sponsors/ILULogo.png' },
  { name: 'BHB', image: '/sponsors/bhb-logo.jpg' },
  { name: 'Daily Bread', image: '/sponsors/dailybreadlogo.png' },
  { name: 'Kijabe Hospital', image: '/sponsors/kijabe.png' },
  { name: 'Kijabe Printing Press', image: '/sponsors/kijabeprintingpresslogo.png' },
  { name: 'Pioneer', image: '/sponsors/pioneerlogo.png' },
  { name: 'Scott Christian University', image: '/sponsors/scott-christian-logo-full.jpeg' },
  { name: 'Truth FM', image: '/sponsors/truthfmlogo.png' },
  { name: 'Lap Fund', image: '/sponsors/lapfund.png' },
  { name: 'Aslead Institute', image: '/sponsors/aslead.png' },
  { name: 'NACADA', image: '/sponsors/nacada.png' },
  { name: 'Rafiki Foundation', image: '/sponsors/rafiki.jpg' },
]

export const forewords = [
  {
    slug: 'bishops',
    label: 'Bishops',
    name: 'Bishop Dr. Abraham Mulwa',
    title: 'Presiding Bishop, AIC Kenya',
    initials: 'AM',
    image: '/office/mulwa.png',
    content: `My fellow Bishops, Reverends, and Pastors; I welcome you to this year’s AIC National Pastors’ Conference. We gather at critical crossroads in the history of the Church. The theme of our conference, Trans-generational Mentorship, anchored in Psalm 78:4-7, is not just a pastoral strategy; it is a divine mandate. God’s design for the church has never been limited to a single generation. His covenant, His truth, and His power are meant to flow seamlessly from the seasoned vessels to the rising generation.

The tragic reality of our time is that many ministries are just one generation away from extinction. We have often focused on building structures and filling pews, while neglecting the intentional spiritual investment required to raise up the next generation of faithful leaders. Psalm 78 warns us of the danger of a generation arising that does not know the Lord or what He has done. As the Africa Inland Church, we must actively reject that outcome.

True success in ministry is not measured only by what we achieve today, but by who stands ready to carry the torch tomorrow. Mentorship is the bridge over which the faith of our fathers travels into the hearts of our children. It demands our time, our patience, and a deliberate willingness to share both our platforms and our wisdom.

Over the next few days, let us sit at the feet of the Master, reflect on our calling, and re-align our ministries. Let us move from being mere leaders to becoming spiritual fathers and mothers. May this conference ignite a fresh fire in our hearts to teach, model, and entrust the uncompromised Gospel to faithful men and women who will, in turn, teach others. I pray that you will all have a meaningful time at the conference, and may God bless you.`,
  },
  {
    slug: 'international',
    label: 'International Guest',
    name: 'Dr. Gary G. Dull',
    title: 'President, Way Of Truth Ministry',
    initials: 'GD',
    image: '/speakers/dull.jpg',
    content: `It is with a profound sense of urgency and divine assignment that I welcome you to this year’s Pastors Conference. Our theme for this gathering, Trans-generational Mentorship, strikes at the very heart of the survival, health, and continuity of the Church of Jesus Christ. True success in ministry is never measured solely by what we accomplish during our lifetime, but by what outlives us.

Scripture reminds us in 2 Timothy 2:2 of our sacred charge: to commit the things we have heard to faithful men and women who will be able to teach others also. Ministry is a relay race, and the transfer of the baton is just as critical as the race itself.

Throughout this conference, we will dive deep into what it means to build bridges between generations. We will explore how to intentionally invest in emerging leaders, honor the wisdom of our veterans, and create sustainable leadership pipelines that ensure the message of the Gospel remains uncompromised for decades to come.

Let us approach these sessions with open hearts, ready to learn, unlearn, and receive the tools necessary to secure the future of our ministries.`,
  },
  {
    slug: 'committee',
    label: 'Planning Committee',
    name: 'Rev. Dr. Luke Odhiambo Awino, PhD.',
    title: 'Chairman, Central Planning Committee',
    initials: 'LA',
    image: '/committee/luke.jpeg',
    content: `On behalf of the Central Planning Committee, I joyfully welcome you to the AIC National Pastors’ Conference. For months, our team has prayed, planned, and prepared for this precise moment, believing that God has a timely word for the Africa Inland Church. Our theme this year, Trans-generational Mentorship, based on Psalm 78:4-7, is an urgent call to action. It forces us to ask a sobering question: What legacy are we leaving behind?

True ministry does not end when our season closes; its success is proven by the spiritual health of the generation that succeeds us. As the planning committee, our prayer is that this conference will not be just another calendar event, but a holy convocation where divine strategies are unlocked.

We have carefully structured our sessions, workshops, and plenaries to challenge, equip, and inspire you to intentionally pull up the next generation of gospel workers. We encourage you to come with an expectant heart, open to learning, unlearning, and relearning. Let us network, share resources, and together build the necessary bridges across generational gaps so that the praises of the Lord will continue to resound in our sanctuaries for generations to come.

Welcome to the Conference!`,
  },
]