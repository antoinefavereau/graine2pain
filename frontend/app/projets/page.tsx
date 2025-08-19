export default function ProjectsPage() {
  return (
    <section className="relative grid place-content-center py-16">
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
      <h1 className="text-8xl font-heading font-bold">PROJETS</h1>
    </section>
  );
}
