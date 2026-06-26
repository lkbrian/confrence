export type SectionHeadingProps = {
  eyebrow: string
  title: string
  text?: string
  light?: boolean
  align?: 'start' | 'center' | 'end'
  className?: string
  strokeWord?: string
}

export type RegistrationStatus = 'idle' | 'loading' | 'success' | 'error'
