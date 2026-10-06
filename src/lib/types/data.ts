export type Speaker = {
  name: string
  ministry: string
  bio: string
  image: string
  imagePosition?: string
  forewordSlug?: string
}

export type ScheduleItem = {
  /** Row id from public.schedules; absent for the static data.ts programme. */
  id?: string
  time: string
  activity: string
  facilitator?: string
}

export type ScheduleDay = {
  day: string
  date: string
  isoDate: string
  items: ScheduleItem[]
}

export type Testimonial = {
  quote: string
  name: string
}

export type Topic = {
  code: string
  topic: string
  brief: string
  speaker: string
}

export type Sponsor = {
  name: string
  image: string
}

export type CommitteeMember = {
  name: string
  title: string
  image?: string
  forewordSlug?: string
}

export type OfficeMember = {
  name: string
  title: string
  image?: string
  forewordSlug?: string
}
