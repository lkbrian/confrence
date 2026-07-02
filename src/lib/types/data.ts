export type Speaker = {
  name: string
  ministry: string
  bio: string
  image: string
  imagePosition?: string
}

export type ScheduleDay = {
  day: string
  date: string
  items: string[]
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
  image: string
}
