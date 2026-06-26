import type { SectionHeadingProps } from '../lib/types/ui'

export default function SectionHeading({ eyebrow, title, text, light = false, align = 'center', className = '', strokeWord }: SectionHeadingProps) {
  const isCenter = align === 'center'
  return (
    <div className={`relative mb-10 max-w-3xl ${isCenter ? 'mx-auto text-center' : 'text-start'} ${className}`}>
      {strokeWord && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -top-6 ${isCenter ? 'left-1/2 -translate-x-1/2' : 'left-0'} select-none text-6xl font-black leading-none text-transparent font-['League_Spartan',sans-serif] ${light ? 'opacity-30 [-webkit-text-stroke:0.5px_#4d9f6c]' : 'opacity-30 [-webkit-text-stroke:0.5px_#042a35]'}`}
        >
          {strokeWord}
        </span>
      )}
      <p className="relative text-sm font-bold uppercase tracking-[0.18em] text-brand-red">{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-extrabold sm:text-4xl ${light ? 'text-white' : 'text-stone-950'}`}>
        {title}
      </h2>
      {text ? (
        <p className={`mt-4 text-lg leading-8 ${light ? 'text-white/72' : 'text-stone-600'}`}>{text}</p>
      ) : null}
    </div>
  )
}
