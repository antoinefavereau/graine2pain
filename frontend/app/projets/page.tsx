export default function ProjectsPage() {
  return (
    <section className="relative grid place-content-center py-12">
      <div
        className="absolute inset-0 -z-10 bg-linear-[to_right,transparent,var(--color-secondary),transparent,var(--color-primary),transparent] bg-size-[200%] opacity-[0.07] mask-repeat-space animate-bg-to-right"
        style={
          {
            maskImage: 'url("/background circle.svg") ',
            maskSize: "auto 23%",
            maskPosition: "center top",
          } as React.CSSProperties
        }
      ></div>
      <h1 className="text-8xl font-heading font-bold">
        PR<span className="sr-only">O</span>
        <div
          className="relative inline-block h-[1.6cap] w-[2.5ch] translate-y-[0.3cap] -mr-[0.4ch] bg-linear-to-r/srgb from-secondary to-primary/50 rounded-[0.65cap]"
          aria-hidden="true"
        >
          <div className="absolute inset-[0.24cap_0.28cap] bg-black rounded-[0.4cap]"></div>
        </div>
        <span className="relative">JETS</span>
      </h1>
    </section>
  );
}
