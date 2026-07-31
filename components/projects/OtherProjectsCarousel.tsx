"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/types/Project";

interface OtherProjectsCarouselProps {
  projects: Project[];
}

export default function OtherProjectsCarousel({
  projects,
}: OtherProjectsCarouselProps) {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="p-48 flex flex-col gap-10">
      <h2 className="text-6xl">On continue ?</h2>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl,
          nextEl,
        }}
        spaceBetween={40}
        slidesPerView={3}
        className="w-full mask-linear-[to_right,#000_60%,#0001_100%]"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
