import { Bus, Camera, Info, Megaphone, MapPin, Mic2, PackageSearch, Utensils } from 'lucide-react'
import { gallery, pastoralChallengeTopics, plenaryTopics, speakers } from '../data'
import type { AnnouncementCategory, LiveEvent, UpdateKind } from './types/happening'

export const VENUE = 'AIC Milimani, Nairobi'
export const THEME = 'Trans-generational Mentorship'

export const categoryMeta: Record<AnnouncementCategory, { label: string; icon: typeof Info }> = {
  transport: { label: 'Transport', icon: Bus },
  meals: { label: 'Meals', icon: Utensils },
  venue: { label: 'Venue', icon: MapPin },
  'lost-found': { label: 'Lost & Found', icon: PackageSearch },
  general: { label: 'General', icon: Info },
}

export const updateKindMeta: Record<UpdateKind, { label: string; icon: typeof Info }> = {
  general: { label: 'Update', icon: Megaphone },
  photo: { label: 'Photo', icon: Camera },
  session: { label: 'Session', icon: Mic2 },
  notice: { label: 'Notice', icon: Info },
}

function surname(name: string) {
  return name.trim().split(/\s+/).at(-1)!.toLowerCase()
}

export function speakerFor(event?: LiveEvent) {
  if (!event?.facilitator) return undefined
  return speakers.find((s) => event.facilitator!.toLowerCase().includes(surname(s.name)))
}

/** Short description for a session, from the plenary / pastoral charge topic briefs in data.ts. */
export function sessionBrief(event: LiveEvent) {
  // 'Plenary 5: …' ↔ code 'P5', 'Pastoral Charge 2: …' ↔ code 'Pc2'
  const match = /^(plenary|pastoral charge) (\d+)/i.exec(event.activity)
  if (match) {
    const code = `${match[1].toLowerCase() === 'plenary' ? 'P' : 'Pc'}${match[2]}`
    const topic = [...plenaryTopics, ...pastoralChallengeTopics].find((t) => t.code === code)
    if (topic) return topic.brief
  }
  if (/tea break|lunch/i.test(event.activity)) return 'Refreshments are served in the church dining hall. A good moment to connect with fellow delegates.'
  if (/hymn|devotion/i.test(event.activity)) return 'Gathering in worship and the Word as we prepare our hearts for the sessions ahead.'
  if (/registration/i.test(event.activity)) return 'Collect your delegate badge and conference pack at the registration desk.'
  if (/panel|q & a/i.test(event.activity)) return 'An open conversation with conference speakers. Bring your questions.'
  if (/closing|conclusion|resolution/i.test(event.activity)) return 'Wrapping up with key takeaways, announcements and next steps.'
  return ''
}

/** Category tag for a session (Plenary, Worship, Break…). */
export function sessionCategory(event: LiveEvent) {
  const a = event.activity
  if (/^plenary/i.test(a)) return 'Plenary'
  if (/pastoral charge/i.test(a)) return 'Pastoral Charge'
  if (/panel/i.test(a)) return 'Panel'
  if (/q & a/i.test(a)) return 'Q & A'
  if (/hymn|devotion/i.test(a)) return 'Worship'
  if (/tea break|lunch/i.test(a)) return 'Break'
  if (/registration/i.test(a)) return 'Registration'
  return 'Session'
}

/** Speaker photo when we have one, otherwise a stable pick from the gallery. */
export function sessionImage(event: LiveEvent) {
  const speaker = speakerFor(event)
  if (speaker) return { src: speaker.image, position: speaker.imagePosition ?? 'top' }
  const hash = [...event.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return { src: gallery[hash % gallery.length].src, position: 'center' }
}
