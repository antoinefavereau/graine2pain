import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative grow flex flex-col items-start justify-center px-40">
      <div
        className="absolute h-2/3 w-auto aspect-square top-1/10 right-[8vh] overflow-hidden select-none pointer-events-none before:absolute before:-inset-1/10 before:bg-linear-to-br before:from-primary before:via-tertiary before:to-secondary before:animate-hexa-spin"
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
              className="relative inline-block h-[1cap] w-[2ch] bg-animated-gradient rounded-[0.8cap]"
              aria-hidden="true"
            >
              <div className="absolute inset-[0.24cap_0.28cap] bg-black rounded-[0.8cap]"></div>
            </div>
            REAU
          </span>
          <span
            className="text-[116px] leading-none"
            style={{
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "1px var(--color-white)",
            }}
          >
            ATHÉNA
          </span>
          <span className="flex justify-between text-xl font-julius">
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
        </h1>
        <Image
          src="/tech line.svg"
          alt="Tech Line"
          width={525}
          height={27}
          className="w-3/4 h-auto place-self-center"
        />
      </div>
    </section>
  );
}
