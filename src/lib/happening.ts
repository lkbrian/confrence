import type { PostgrestError } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'
import { fmt } from './timeline'
import type { Announcement, AnnouncementCategory, DayRecap, HappeningData, LiveEvent, LiveUpdate, UpdateKind } from './types/happening'

// Must match the bucket referenced in policies by supabase/happening.sql. Uploads use the admin's
// auth session + RLS, never S3 access keys (those would be exposed in the browser bundle).
const PHOTO_BUCKET = (import.meta.env.VITE_BUCKET_NAME as string | undefined) || 'confrence'

const EMPTY: HappeningData = { extensions: {}, updates: [], announcements: [], recaps: {} }

/** Thrown when a write is rejected because the admin session is gone or lacks rights. */
export class AuthExpiredError extends Error {
  constructor() {
    super('Your session has expired, please sign in again.')
    this.name = 'AuthExpiredError'
  }
}

export function check(error: PostgrestError | null) {
  if (!error) return
  if (error.code === '42501' || error.code === 'PGRST301' || /jwt|row-level security/i.test(error.message)) {
    throw new AuthExpiredError()
  }
  throw new Error(error.message)
}

async function fetchAll(): Promise<HappeningData> {
  const [ext, upd, ann, rec] = await Promise.all([
    supabase.from('event_extensions').select('event_id, minutes'),
    supabase.from('live_updates').select('*').order('created_at', { ascending: false }),
    supabase.from('announcements').select('*').order('created_at', { ascending: false }),
    supabase.from('day_recaps').select('*'),
  ])
  for (const r of [ext, upd, ann, rec]) check(r.error)

  return {
    extensions: Object.fromEntries((ext.data ?? []).map((row) => [row.event_id as string, row.minutes as number])),
    updates: (upd.data ?? []) as LiveUpdate[],
    announcements: (ann.data ?? []) as Announcement[],
    recaps: Object.fromEntries(((rec.data ?? []) as DayRecap[]).map((r) => [r.day, r])),
  }
}

/** Loads all live data and keeps it fresh through Supabase Realtime. */
export function useHappening() {
  const [data, setData] = useState<HappeningData>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const timer = useRef<number | undefined>(undefined)

  const refresh = useCallback(
    () =>
      fetchAll()
        .then((next) => {
          setData(next)
          setError('')
        })
        .catch((err: Error) => setError(err.message || 'Could not load live updates.'))
        .finally(() => setLoading(false)),
    [],
  )

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel(`happening-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        // Bursts of changes (e.g. extend + auto-post) collapse into one refetch.
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(refresh, 250)
      })
      .subscribe()
    return () => {
      window.clearTimeout(timer.current)
      supabase.removeChannel(channel)
    }
  }, [refresh])

  return { data, loading, error, refresh }
}

export async function extendEvent(event: LiveEvent, minutes: number) {
  const { data: row, error: readError } = await supabase
    .from('event_extensions')
    .select('minutes')
    .eq('event_id', event.id)
    .maybeSingle()
  check(readError)

  const total = (row?.minutes ?? 0) + minutes
  const { error } = await supabase
    .from('event_extensions')
    .upsert({ event_id: event.id, minutes: total, updated_at: new Date().toISOString() })
  check(error)

  await addUpdate({
    day: event.dayIndex + 1,
    kind: 'session',
    title: `${event.activity} extended by ${minutes} min`,
    body: `Now ends at ${fmt(event.end + minutes)}. Later sessions today have moved back by ${minutes} minutes.`,
  })
}

export async function resetExtension(eventId: string) {
  const { error } = await supabase.from('event_extensions').delete().eq('event_id', eventId)
  check(error)
}

export async function addUpdate(input: { day: number; kind: UpdateKind; title: string; body?: string; image_url?: string | null }) {
  const { error } = await supabase.from('live_updates').insert({
    day: input.day,
    kind: input.kind,
    title: input.title,
    body: input.body || null,
    image_url: input.image_url || null,
  })
  check(error)
}

export async function deleteUpdate(id: string) {
  const { error } = await supabase.from('live_updates').delete().eq('id', id)
  check(error)
}

export async function addAnnouncement(input: { day: number | null; category: AnnouncementCategory; title: string; body?: string }) {
  const { error } = await supabase.from('announcements').insert({ ...input, body: input.body || null })
  check(error)
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  check(error)
}

export async function saveRecap(day: number, text: string, images: string[]) {
  const { error } = await supabase
    .from('day_recaps')
    .upsert({ day, text: text || null, images, updated_at: new Date().toISOString() })
  check(error)
}

export async function resetAll() {
  const results = await Promise.all([
    supabase.from('event_extensions').delete().neq('event_id', ''),
    supabase.from('live_updates').delete().not('id', 'is', null),
    supabase.from('announcements').delete().not('id', 'is', null),
    supabase.from('day_recaps').delete().gte('day', 0),
  ])
  for (const r of results) check(r.error)
}

async function resizeImage(file: File, maxSize = 1600): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not process image.'))), 'image/jpeg', 0.82),
  )
}

export async function uploadPhoto(file: File, day: number) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  const blob = await resizeImage(file)
  const path = `day${day}/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: 'image/jpeg' })
  if (error) {
    if (/row-level security|unauthorized|jwt/i.test(error.message)) throw new AuthExpiredError()
    throw new Error(error.message)
  }
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
}

const IMAGE_FILE = /\.(jpe?g|png|webp|avif|gif)$/i

/**
 * Every image in the photo bucket, newest first: files at the root plus one folder level
 * (uploads from this app go to day1/, day2/…; dashboard uploads can go anywhere).
 */
export async function listBucketPhotos() {
  const bucket = supabase.storage.from(PHOTO_BUCKET)
  const { data: root, error } = await bucket.list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } })
  if (error) throw new Error(error.message)

  // Folders come back without an id.
  const folders = (root ?? []).filter((item) => item.id === null).map((item) => item.name)
  const nested = await Promise.all(
    folders.map(async (folder) => {
      const { data } = await bucket.list(folder, { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } })
      return (data ?? []).filter((item) => item.id !== null).map((item) => ({ ...item, name: `${folder}/${item.name}` }))
    }),
  )

  return [...(root ?? []).filter((item) => item.id !== null), ...nested.flat()]
    .filter((item) => IMAGE_FILE.test(item.name))
    .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
    .map((item) => bucket.getPublicUrl(item.name).data.publicUrl)
}
