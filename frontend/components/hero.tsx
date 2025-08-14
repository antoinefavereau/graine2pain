import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative grow">
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
    </section>
  );
}
