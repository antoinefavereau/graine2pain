import type { Project } from "@/types/Project";

import Image from "next/image";

import HeroIntro from "@/components/home/HeroIntro";
import PhoneMockupGroup from "@/components/PhoneMockupGroup";
import Navbar from "@/components/Navbar";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const images = project.images ?? [];
  const hasThreeImages = images.length >= 3;
  const hasSingleImage = images.length === 1;

  return (
    <section className="min-h-dvh flex flex-col justify-between pb-24 px-6 sm:px-8 md:px-12 relative overflow-hidden">
      {/* ── 3 images : téléphones en fond ── */}
      {hasThreeImages && (
        <div className="absolute inset-y-24 top-40 inset-x-6 sm:inset-x-8 md:inset-x-12 -z-10">
          <PhoneMockupGroup
            images={images}
            title={project.title}
            maxItems={3}
          />
        </div>
      )}

      {/* ── 1 image : fond plein ── */}
      {hasSingleImage && images[0]?.image?.url && (
        <div className="absolute inset-y-24 top-40 inset-x-6 sm:inset-x-8 md:inset-x-12 -z-10">
          <Image
            src={images[0].image.url}
            alt={project.title}
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-grey-black from-0% via-grey-black via-30% to-transparent to-70%" />

      <Navbar />

      {/* Content */}
      <div className="relative flex flex-col">
        {project.subTitle && (
          <p className="text-lg sm:text-2xl lg:text-3xl font-extralight tracking-[120%] uppercase text-secondary-light text-center mb-2 sm:mb-4">
            {project.subTitle}
          </p>
        )}
        <HeroIntro
          title={project.title}
          titleHighlight={project.titleHighlight}
        />
      </div>
    </section>
  );
}
