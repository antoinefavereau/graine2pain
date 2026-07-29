"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Orb from "@/components/Orb";
import HeroIntro from "@/components/home/HeroIntro";
import InfosCard from "@/components/home/InfosCard";
import RecommandationsCard from "@/components/home/RecommandationsCard";
import ProjectCard from "@/components/home/ProjectsCard";

interface HomeProps {
  tags: any[];
  infos: any[];
  recommandations: any[];
  projects: any[];
}

export default function Home({
  tags,
  infos,
  recommandations,
  projects,
}: Readonly<HomeProps>) {
  const ENTRY_DURATION = 0.8;
  const ENTRY_STAGGER = 0.2;
  const ENTRY_DELAY = 0.4;

  const rootRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const infosRef = useRef<HTMLDivElement>(null);
  const recommandationsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const elements = [
        orbRef.current,
        infosRef.current,
        recommandationsRef.current,
        projectsRef.current,
      ].filter(Boolean) as HTMLElement[];

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: ENTRY_DELAY,
      });

      timeline.set(elements, { autoAlpha: 0, y: 16 });
      timeline.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration: ENTRY_DURATION,
        stagger: ENTRY_STAGGER,
        clearProps: "opacity,visibility,transform",
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen pt-36 pb-10 flex flex-col justify-between gap-16 bg-black"
    >
      <Orb ref={orbRef} style={{ opacity: 0, transform: "translateY(16px)" }} />

      <div className="my-auto">
        <HeroIntro title="Bienvenue dans mon" titleHighlight="portfolio" />
      </div>

      <div className="relative  grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 self-center px-10">
        <InfosCard
          ref={infosRef}
          infos={infos}
          wrapperStyle={{ opacity: 0, transform: "translateY(16px)" }}
        />
        <RecommandationsCard
          ref={recommandationsRef}
          recommandations={recommandations}
          style={{ opacity: 0, transform: "translateY(16px)" }}
        />
        <ProjectCard
          ref={projectsRef}
          projects={projects}
          wrapperStyle={{ opacity: 0, transform: "translateY(16px)" }}
        />
      </div>
    </div>
  );
}
