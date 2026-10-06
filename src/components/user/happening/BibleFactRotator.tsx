import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { bibleFacts } from '../../../lib/bibleFacts'

/**
 * "Did you know?" line. The fact is chosen by `factKey` (the shown session's position in the
 * conference), so it stays put for the length of a session and moves on when the session changes.
 * Keys past the end of the list wrap around, recycling the facts.
 */
export default function BibleFactRotator({ factKey, className = '' }: { factKey: number; className?: string }) {
  const index = ((factKey % bibleFacts.length) + bibleFacts.length) % bibleFacts.length
  const { fact, ref } = bibleFacts[index]

  return (
    <div className={`flex max-w-2xl items-start gap-3 ${className}`} aria-live="polite">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-white/10 text-brand-green">
        <BookOpen size={16} />
      </span>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className="min-h-12 text-sm leading-6 text-white/80 sm:text-base"
        >
          {/* Block span (not <p>): a <p> can't sit inside this <p>. */}
          <span className="mr-1.5 block text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">Did you know?</span>
          {fact}
          {ref && <span className="ml-1.5 whitespace-nowrap text-white/50">— {ref}</span>}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
