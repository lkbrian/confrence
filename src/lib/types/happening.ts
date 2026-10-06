export type LiveEvent = {
  id: string
  dayIndex: number
  index: number
  activity: string
  facilitator?: string
  baseStart: number
  baseEnd: number
  start: number
  end: number
  extendedBy: number
  shiftedBy: number
}

export type UpdateKind = 'photo' | 'session' | 'notice' | 'general'

export type LiveUpdate = {
  id: string
  day: number
  kind: UpdateKind
  title: string
  body: string | null
  image_url: string | null
  created_at: string
}

export type AnnouncementCategory = 'transport' | 'meals' | 'venue' | 'lost-found' | 'general'

export type Announcement = {
  id: string
  day: number | null
  category: AnnouncementCategory
  title: string
  body: string | null
  created_at: string
}

export type DayRecap = {
  day: number
  text: string | null
  images: string[]
  updated_at: string
}

export type Extensions = Record<string, number>

export type HappeningData = {
  extensions: Extensions
  updates: LiveUpdate[]
  announcements: Announcement[]
  recaps: Record<number, DayRecap>
}

export type LivePhase = 'before' | 'live' | 'between' | 'after'

export type LiveStatus = {
  phase: LivePhase
  dayIndex: number
  isConferenceDay: boolean
  current?: LiveEvent
  upcoming: LiveEvent[]
}
