import type { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

export const revealProps = {
  variants: fadeInUp,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, ease: 'easeOut' },
} as const
