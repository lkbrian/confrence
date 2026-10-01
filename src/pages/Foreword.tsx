import {
  forewords
}

  from "@/data";

import {
  ArrowLeft
}

  from "lucide-react";

import {
  Link,
  Navigate,
  useParams
}

  from "react-router-dom";

export default function ForewordPage() {
  const {
    slug
  }

    = useParams();

  const foreword = forewords.find((item) => item.slug === slug);

  if (!foreword) {
    return <Navigate to="/" replace />;
  }

  const paragraphs = foreword.content.split("\n\n");

  return (<main className="relative min-h-screen bg-brand-cream text-stone-900">
    <header className="border-b border-brand-green/12 bg-brand-dark text-white fixed w-full z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <Link to="/" className="flex items-center rounded-md bg-white p-1">
          <img className="w-44 sm:w-60" src="/aic-logo.png" alt="AIC Pastors Conference" />
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"> <ArrowLeft size={16} /> Back to site </Link>
      </div>
    </header>
    <div className="w-full bg-white pt-10">
      <article className="relative mx-auto min-h-300 w-full max-w-300 overflow-hidden bg-white">
        <div className="pointer-events-none absolute right-0 top-0 h-70 w-70 opacity-40 bg-[radial-gradient(#d5d5d5_1px, transparent_1px)] bg-size-[8px_8px] mask-[linear-gradient(135deg, black, transparent)] " />

        <header className="relative z-10 px-13.75 pt-14.5"> <div className="">
          <div className="relative flex flex-col sm:flex-row sm:gap-2 sm:mt-11.25 min-h-50 rounded-r-[22px]  text-white"> <div className="relative h-77.5 z-30">
            <div className="absolute -bottom-1 -left-10 sm:-left-2.5 h-60 w-50 rounded-b-[6px] bg-[#c81e2b]" />
            <img src={
              foreword.image
            }

              alt={
                foreword.name
              } className="relative z-10 block h-75 w-62.5 sm:rounded-tr-[28px] object-cover sm:-mt-1 -ml-10 sm:ml-0 bg-brand-dark "
            />
          </div>
            <div className="absolute bottom-0 -left-10 -right-10 sm:left-0 h-full sm:h-70 w-[110%] sm:w-full rounded-[6px] bg-brand-green" />
            <div className="absolute top-1 left-[45%] lg:left-[30%] rounded-full hidden sm:block  bg-[#e5222e] px-5 py-2">
              <span className="text-[14px] font-bold uppercase tracking-wide">
                Message from the
                <span className="font-light"> {
                  foreword.label
                }

                </span>
              </span>
            </div>
            <div className="z-40 p-3 sm:px-9 sm:pb-8 sm:pt-15.5">
              <div className=" sm:hidden w-fit mb-4 -ml-10 bg-[#e5222e] px-5 py-2">
              <span className="text-[14px] font-bold uppercase tracking-wide">
                Message from the
                <span className="font-light"> {
                  foreword.label
                }

                </span>
              </span>
              </div>
              <div className="-ml-10 sm:ml-0">
                <h1 className="text-[clamp(28px,4vw,42px)] font-bold leading-[1.05] tracking-[-1.5px]">
                {foreword.name}</h1>
              <div className="my-3 h-px w-full bg-white/50" />
              <p className="text-[17px] leading-6 text-white/95 instrument-italic"> {
                foreword.title
              }

              </p>
              <p className="mt-0 text-[18px]">
                AIC National Pastors' Conference
              </p>
              </div>
            </div>
          </div>
        </div>
        </header>

        <section className="relative z-10 px-6 pb-24 pt-11 sm:px-20">
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-[15px] leading-[1.65] text-[#262626] 
                ${index === 0 ? 'instrument-italic text-[17px]' : ''}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

      </article>
    </div>
  </main>);
}