type Props = {
  eyebrow: string
  title: string
  text?: string
  light?: boolean
  align?: 'start' | 'center' | 'end'
  className?: string
}

export default function SectionHeading({ eyebrow, title, text, light = false, align = 'center', className = '' }: Props) {
  const isCenter = align === 'center'
  return (
    <div className={`mb-10 max-w-3xl ${isCenter ? 'mx-auto text-center' : 'text-start'} ${className}`}>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B21A]">{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-extrabold sm:text-4xl ${light ? 'text-white' : 'text-stone-950'}`}>
        {title}
      </h2>
      {text ? (
        <p className={`mt-4 text-lg leading-8 ${light ? 'text-white/72' : 'text-stone-600'}`}>{text}</p>
      ) : null}
    </div>
  )
}
