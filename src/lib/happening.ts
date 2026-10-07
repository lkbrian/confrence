import type { PostgrestError } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'
import { fmt, maxReduction } from './timeline'
import type { Announcement, AnnouncementCategory, DayRecap, HappeningData, LiveEvent, LiveUpdate, UpdateKind } from './types/happening'

// Must match the bucket referenced in policies by supabase/happening.sql. Uploads use the admin's
// auth session + RLS, never S3 access keys (those would be exposed in the browser bundle).
const PHOTO_BUCKET = (import.meta.env.VITE_BUCKET_NAME as string | undefined) || 'pastors-conf'

const EMPTY: HappeningData = { extensions: {}, updates: [], announcements: [], recaps: {} }

/**
 * Thrown when the server rejects a write on auth/RLS grounds. That is either an expired session or
 * missing policies (e.g. for a renamed bucket); useAdminRun asks the auth server which before signing out.
 */
export class AuthExpiredError extends Error {
  /** The server's own message, shown when the session turns out to be valid. */
  detail: string

  constructor(detail = '') {
    super('Your session has expired, please sign in again.')
    this.name = 'AuthExpiredError'
    this.detail = detail
  }
}

export function check(error: PostgrestError | null) {
  if (!error) return
  if (error.code === '42501' || error.code === 'PGRST301' || /jwt|row-level security/i.test(error.message)) {
    throw new AuthExpiredError(error.message)
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

/**
 * Extends (positive minutes) or shortens (negative minutes) a session; later sessions cascade.
 * `now` is the current conference-day time when the session is live, so it can't end in the past.
 */
export async function adjustEvent(event: LiveEvent, minutes: number, now?: number) {
  const limit = maxReduction(event, now)
  if (minutes < 0 && -minutes > limit) {
    throw new Error(`${event.activity} can be shortened by at most ${limit} min.`)
  }

  const { data: row, error: readError } = await supabase
    .from('event_extensions')
    .select('minutes')
    .eq('event_id', event.id)
    .maybeSingle()
  check(readError)

  const total = (row?.minutes ?? 0) + minutes
  const { error } =
    total === 0
      ? await supabase.from('event_extensions').delete().eq('event_id', event.id)
      : await supabase.from('event_extensions').upsert({ event_id: event.id, minutes: total, updated_at: new Date().toISOString() })
  check(error)

  const amount = Math.abs(minutes)
  await addUpdate({
    day: event.dayIndex + 1,
    kind: 'session',
    title: `${event.activity} ${minutes > 0 ? 'extended' : 'shortened'} by ${amount} min`,
    body: `Now ends at ${fmt(event.end + minutes)}. Later sessions today have moved ${minutes > 0 ? 'back' : 'forward'} by ${amount} minutes.`,
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
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error(
      /\.hei[cf]$/i.test(file.name)
        ? `${file.name} is a HEIC photo, which browsers can't read. Export it as JPEG first.`
        : `${file.name} could not be read as an image.`,
    )
  })
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
  // Some systems leave `type` empty (e.g. HEIC on Windows), so fall back to the extension.
  if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|avif|gif|bmp|hei[cf])$/i.test(file.name)) {
    throw new Error(`${file.name} is not an image file.`)
  }
  const blob = await resizeImage(file)
  const path = `day${day}/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: 'image/jpeg' })
  if (error) {
    if (/row-level security|unauthorized|jwt/i.test(error.message)) throw new AuthExpiredError(error.message)
    throw new Error(error.message)
  }
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
}

/** The object path inside the photo bucket for one of its public URLs, or null for any other URL. */
function bucketPath(url: string) {
  const marker = `/storage/v1/object/public/${PHOTO_BUCKET}/`
  const at = url.indexOf(marker)
  return at === -1 ? null : decodeURIComponent(url.slice(at + marker.length).split('?')[0])
}

/**
 * Deletes a photo from the bucket, then takes it off every live update and recap that shows it,
 * so the live page never points at a missing file.
 */
export async function deleteBucketPhoto(url: string) {
  const path = bucketPath(url)
  if (!path) throw new Error('Only photos stored in the bucket can be deleted.')

  const bucket = supabase.storage.from(PHOTO_BUCKET)
  const { data: removed, error } = await bucket.remove([path])
  if (error) {
    if (/row-level security|unauthorized|jwt/i.test(error.message)) throw new AuthExpiredError(error.message)
    throw new Error(error.message)
  }
  // Nothing removed means RLS blocked it or the file was already gone; only the first is an error.
  if (!removed?.length) {
    const slash = path.lastIndexOf('/')
    const { data: still } = await bucket.list(path.slice(0, Math.max(slash, 0)), { search: path.slice(slash + 1) })
    if (still?.some((item) => item.name === path.slice(slash + 1))) throw new AuthExpiredError('The photo was not deleted.')
  }

  const [updates, recaps] = await Promise.all([
    supabase.from('live_updates').update({ image_url: null }).eq('image_url', url),
    supabase.from('day_recaps').select('day, images').contains('images', [url]),
  ])
  check(updates.error)
  check(recaps.error)
  // Leave updated_at alone: the admin recap form is keyed on it and would lose unsaved edits.
  const results = await Promise.all(
    ((recaps.data ?? []) as Pick<DayRecap, 'day' | 'images'>[]).map((r) =>
      supabase.from('day_recaps').update({ images: r.images.filter((src) => src !== url) }).eq('day', r.day),
    ),
  )
  for (const r of results) check(r.error)
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
