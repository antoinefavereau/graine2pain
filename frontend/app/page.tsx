import Header from "@/components/header";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Hero />
      </div>
      <a
        href="/projets"
        className="group fixed bottom-12 right-12 p-[2px] rounded-full bg-linear-to-b/srgb from-primary to-secondary"
      >
        <div className="p-4 rounded-full bg-dark font-bold group-hover:bg-dark-hover">
          VOIR PROJETS
        </div>
      </a>
    </>
  );
}
