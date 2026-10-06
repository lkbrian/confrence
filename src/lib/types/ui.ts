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

/** Runs an admin write, shows a success/error toast, and resolves to whether it succeeded. */
export type RunAction = (action: () => Promise<unknown>, successMessage: string) => Promise<boolean>
