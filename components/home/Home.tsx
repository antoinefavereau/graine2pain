"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Card from "@/components/Card";
import Marquee from "@/components/Marquee";
import Orb from "@/components/Orb";
import HeroIntro from "@/components/home/HeroIntro";
import InfosCard from "@/components/home/InfosCard";
import RecommandationsCard from "@/components/home/RecommandationsCard";
import ProjectsCard from "@/components/home/ProjectsCard";

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
  const marqueeTopRef = useRef<HTMLDivElement>(null);
  const marqueeBottomRef = useRef<HTMLDivElement>(null);
  const infosRef = useRef<HTMLDivElement>(null);
  const recommandationsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const elements = [
        orbRef.current,
        marqueeTopRef.current,
        marqueeBottomRef.current,
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

  const tagsItems = tags.map((tag: any) => (
    <Card
      key={tag.id}
      className="text-nowrap px-3 py-1.5 text-grey-base text-xs"
    >
      {tag.name}
    </Card>
  ));

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen pt-36 pb-10 flex flex-col justify-between gap-16 bg-black"
    >
      <Orb ref={orbRef} />

      <div className="flex flex-col gap-12">
        <Marquee ref={marqueeTopRef} direction="left">
          {tagsItems}
        </Marquee>

        <HeroIntro />

        <Marquee ref={marqueeBottomRef} direction="right">
          {tagsItems}
        </Marquee>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 self-center px-10">
        <InfosCard ref={infosRef} infos={infos} />
        <RecommandationsCard
          ref={recommandationsRef}
          recommandations={recommandations}
        />
        <ProjectsCard ref={projectsRef} projects={projects} />
      </div>
    </div>
  );
}
