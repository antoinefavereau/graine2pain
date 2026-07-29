import { forwardRef } from "react";

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
        className="flex flex-col gap-5 p-5 pb-2"
      >
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
          {projects.map((project) => {
            return (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            );
          })}
        </ul>
      </Card>
    );
  },
);

export default ProjectsCard;
