"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative grow flex flex-col items-start justify-center px-40">
      <div
        className="absolute h-2/3 w-auto aspect-square top-1/10 right-[8vh] overflow-hidden select-none pointer-events-none before:absolute before:-inset-1/10 before:bg-linear-to-br/srgb before:from-primary before:to-secondary before:animate-hexa-spin"
        style={
          {
            mask: 'url("/hexa tech shape.svg") no-repeat center/contain',
            WebkitMask: 'url("/hexa tech shape.svg") no-repeat center/contain',
          } as React.CSSProperties
        }
      ></div>
      <div className="absolute top-0 right-0 w-auto h-full select-none pointer-events-none">
        <Image
          src="/moreau athena.png"
          alt="Moreau Athéna"
          width={500}
          height={500}
          className="w-auto h-full"
        />
        <div className="absolute left-0 right-0 bottom-0 h-1/6 bg-gradient-to-b from-transparent to-black" />
        <div className="absolute left-0 bottom-0 h-1/4 w-1/10 bg-gradient-to-l from-transparent to-black" />
      </div>
      <div className="relative flex flex-col items-start space-y-6">
        <h1
          className="relative flex flex-col space-y-3 font-heading font-black"
          aria-label="Moreau Athéna"
        >
          <span className="group text-[100px] leading-none">
            M<span className="sr-only">O</span>
            <div
              className="relative inline-block h-[1cap] w-[2ch] bg-animated-gradient-primary-to-secondary rounded-[0.8cap]"
              aria-hidden="true"
            >
              <div className="absolute inset-[0.24cap_0.28cap] bg-black rounded-[0.8cap]"></div>
            </div>
            REAU
          </span>
          <span
            className="group text-[116px] leading-none bg-animated-gradient-from-transparent bg-clip-text text-transparent transition-all duration-300"
            style={{
              WebkitTextStroke: "1px var(--color-white)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.webkitTextStroke = "0px transparent";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.webkitTextStroke = "1px var(--color-white)";
            }}
          >
            ATHÉNA
          </span>
          <span className="group overflow-hidden">
            <span className="flex justify-between text-2xl font-julius leading-none text-shadow-[0_-22px_white] transform group-hover:translate-y-[22px] transition-transform duration-300">
              <span>P</span>
              <span>o</span>
              <span>r</span>
              <span>t</span>
              <span>f</span>
              <span>o</span>
              <span>l</span>
              <span>i</span>
              <span>o</span>
            </span>
          </span>
        </h1>
        <Image
          src="/tech line.svg"
          alt="Tech Line"
          width={525}
          height={27}
          className="w-3/4 h-auto place-self-center select-none pointer-events-none"
        />
      </div>
      <a
        href="#"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1"
      >
        <div className="h-2 w-2 -mt-1 rotate-45 border-r-3 border-b-3 border-white opacity-80 animate-[scrollerPulse_1200ms_ease-in-out_infinite_0ms]"></div>
        <div className="h-4 w-4 -mt-3 rotate-45 border-r-3 border-b-3 border-white opacity-80 animate-[scrollerPulse_1200ms_ease-in-out_infinite_300ms]"></div>
        <div className="h-5 w-5 -mt-4 rotate-45 border-r-3 border-b-3 border-white opacity-80 animate-[scrollerPulse_1200ms_ease-in-out_infinite_600ms]"></div>
        <div className="text-white opacity-80 animate-[scrollerPulse_1200ms_ease-in-out_infinite_900ms]">
          Scroller
        </div>
      </a>
    </section>
  );
}
