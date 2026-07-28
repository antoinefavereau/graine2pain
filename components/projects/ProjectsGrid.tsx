"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/Project";
import Card from "@/components/Card";

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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <li key={project.id}>
              <Card>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex flex-col gap-4 p-4 group"
                >
                  <div className="aspect-video w-full overflow-hidden rounded-xl">
                    <Image
                      src={project.image.url || ""}
                      alt={project.title}
                      width={600}
                      height={338}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-base font-semibold">{project.title}</h2>
                    <p className="text-sm text-grey-base line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
