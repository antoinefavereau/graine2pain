import Image from "next/image";
import { forwardRef } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Link from "next/link";
import type { Project } from "@/types/Project";

interface ProjectsCardProps {
  projects: Project[];
}

const ProjectsCard = forwardRef<HTMLDivElement, ProjectsCardProps>(
  function ProjectsCard({ projects }, ref) {
    return (
      <Card ref={ref} className="flex flex-col gap-5 p-5 pb-2">
        <div className="flex justify-between align-top">
          <h2 className="text-xl font-bold">Derniers projets</h2>
          <Button variant="outline" color="grey" onlyIcon href="/projects">
            <Icon name="arrow_outward" className="text-2xl text-grey-lighter" />
          </Button>
        </div>
        <ul
          className="flex flex-col gap-5 overflow-y-auto max-h-44 scrollbar-hide mask-linear-[to_bottom,#000_60%,#0001_100%] pb-10"
          data-lenis-prevent
        >
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="flex items-start gap-4"
              >
                <Image
                  src={project.image.url || ""}
                  alt={project.title}
                  width={200}
                  height={200}
                  className="w-36 rounded-lg aspect-video object-cover shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-xs text-justify line-clamp-3 text-ellipsis">
                    {project.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    );
  },
);

export default ProjectsCard;
