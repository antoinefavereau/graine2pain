"use client";

import type { Project } from "@/types/Project";
import ProjectCard from "@/components/projects/ProjectCard";

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="min-h-screen pt-36 pb-16 px-6 sm:px-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">Projets</h1>

      {projects.length === 0 ? (
        <p className="text-grey-base text-lg">Aucun projet pour le moment.</p>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
