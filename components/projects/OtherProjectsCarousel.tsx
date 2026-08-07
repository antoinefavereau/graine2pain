"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";

import "swiper/css";

import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/types/Project";

interface OtherProjectsCarouselProps {
  projects: Project[];
}

export default function OtherProjectsCarousel({
  projects,
}: OtherProjectsCarouselProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="p-6 py-16 md:p-16 lg:p-28 xl:p-48 flex flex-col gap-6 md:gap-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal">
        On continue ?
      </h2>

      <Swiper
        modules={[Mousewheel]}
        spaceBetween={24}
        slidesPerView="auto"
        className="w-full mask-linear-[to_right,#000_60%,#0001_100%]"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id} className="w-[min(350px,80vw)]!">
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
