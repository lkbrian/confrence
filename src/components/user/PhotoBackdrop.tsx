import { useEffect, useState } from 'react'
import { listBucketPhotos } from '@/lib/happening'

// One bucket listing per visit, shared by every page that shows a backdrop.
let photosRequest: Promise<string[]> | null = null

function loadPhotos() {
  photosRequest ??= listBucketPhotos().catch(() => {
    photosRequest = null // Retry on the next page instead of caching the failure.
    return []
  })
  return photosRequest
}

/** A random conference photo filling its (relative) parent, under a brand-dark overlay. */
export default function PhotoBackdrop() {
  const [src, setSrc] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    loadPhotos().then((photos) => {
      if (active && photos.length) setSrc(photos[Math.floor(Math.random() * photos.length)])
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {src && (
        <img
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          className={`size-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      <div className="absolute inset-0 bg-brand-dark/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-transparent to-brand-dark" />
    </div>
  )
}
