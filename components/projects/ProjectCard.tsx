import type { Project } from "@/types/Project";

import Link from "next/link";
import Image from "next/image";

import Card from "@/components/Card";
import PhoneMockupGroup from "@/components/PhoneMockupGroup";

export type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const imgs = project.images ?? [];
  const hasThree = imgs.length >= 3;

  return (
    <Card variant="dark">
      <Link
        href={`/projects/${project.id}`}
        className="flex flex-col gap-4 aspect-video p-5 pb-0"
      >
        <p className="text-xs text-grey-lighter uppercase tracking-[95%]">
          {project.subTitle}
        </p>
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 overflow-hidden">
            {hasThree ? (
              <div className="absolute inset-0 h-[130%] flex items-center justify-start">
                <PhoneMockupGroup
                  images={imgs}
                  title={project.title}
                  maxItems={2}
                  className="justify-start"
                />
              </div>
            ) : imgs[0] ? (
              <Image
                src={imgs[0].image?.url || ""}
                alt={project.title}
                fill
                className="object-contain object-bottom-left"
              />
            ) : null}
          </div>

          <h3 className="text-lg sm:text-xl text-grey-light font-extralight pb-5 text-end self-end">
            {project.title}
            {project.titleHighlight && (
              <>
                <br />
                <span className="bg-linear-to-r font-medium from-primary-base to-secondary-base bg-clip-text text-transparent">
                  {project.titleHighlight}
                </span>
              </>
            )}
          </h3>
        </div>
      </Link>
    </Card>
  );
}
