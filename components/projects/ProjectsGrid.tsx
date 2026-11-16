"use client";

import type { Project } from "@/types/Project";
import ProjectCard from "@/components/projects/ProjectCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const t = useTranslations("Projects");

  return (
    <div className="min-h-dvh relative flex flex-col gap-6 md:gap-20">
      <Navbar />
      <div className="w-full max-w-7xl self-center pb-16 px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10">
          {t("title")}
        </h1>

        {projects.length === 0 ? (
          <p className="text-grey-base text-sm sm:text-lg">{t("empty")}</p>
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
      <Footer />
    </div>
  );
}
