"use client";

import { forwardRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";

import "swiper/css";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import type { Project } from "@/types/Project";
import ProjectCard from "@/components/projects/ProjectCard";

interface ProjectsCardProps {
  projects: Project[];
  wrapperStyle?: React.CSSProperties;
}

const ProjectsCard = forwardRef<HTMLDivElement, ProjectsCardProps>(
  function ProjectsCard({ projects, wrapperStyle }, ref) {
    return (
      <Card
        ref={ref}
        wrapperStyle={wrapperStyle}
        wrapperClassName="col-span-1 lg:col-span-2 xl:col-span-1"
        className="flex flex-col gap-5 p-5"
      >
        <div className="flex justify-between align-top">
          <h2 className="text-xl font-bold">Derniers projets</h2>
          <Button variant="outline" color="grey" onlyIcon href="/projects">
            <Icon name="arrow_outward" className="text-2xl text-grey-lighter" />
          </Button>
        </div>

        {projects && projects.length > 0 ? (
          <Swiper
            modules={[Mousewheel]}
            mousewheel
            loop={projects.length > 1}
            spaceBetween={16}
            slidesPerView="auto"
            className="w-full mask-linear-[to_right,#000_60%,#0001_100%]"
          >
            {projects.map((project) => (
              <SwiperSlide key={project.id} className="w-[min(300px,80vw)]!">
                <ProjectCard project={project} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
      </Card>
    );
  },
);

export default ProjectsCard;
