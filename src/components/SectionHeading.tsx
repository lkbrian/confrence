type Props = {
  eyebrow: string
  title: string
  text?: string
  light?: boolean
  align?: 'start' | 'center' | 'end'
  className?: string
  strokeWord?: string
}

export default function SectionHeading({ eyebrow, title, text, light = false, align = 'center', className = '', strokeWord }: Props) {
  const isCenter = align === 'center'
  return (
    <div className={`relative mb-10 max-w-3xl ${isCenter ? 'mx-auto text-center' : 'text-start'} ${className}`}>
      {strokeWord && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -top-6 ${isCenter ? 'left-1/2 -translate-x-1/2' : 'left-0'} select-none text-6xl font-black leading-none text-transparent font-['League_Spartan',sans-serif] ${light ? 'opacity-10 [-webkit-text-stroke:0.5px_white]' : 'opacity-18 [-webkit-text-stroke:0.5px_#000]'}`}
        >
          {strokeWord}
        </span>
      )}
      <p className="relative text-sm font-bold uppercase tracking-[0.18em] text-[#F2B21A]">{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-extrabold sm:text-4xl ${light ? 'text-white' : 'text-stone-950'}`}>
        {title}
      </h2>
      {text ? (
        <p className={`mt-4 text-lg leading-8 ${light ? 'text-white/72' : 'text-stone-600'}`}>{text}</p>
      ) : null}
    </div>
  )
}
