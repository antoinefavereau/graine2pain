import Image from "next/image";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";

interface ProjectsCardProps {
  projects: any[];
}

export default function ProjectsCard({ projects }: ProjectsCardProps) {
  return (
    <Card className="flex flex-col gap-5 p-5 max-w-md">
      <div className="flex justify-between align-top">
        <h2 className="text-xl font-bold">Derniers projets</h2>
        <Button variant="outline" color="grey" onlyIcon>
          <Icon name="arrow_outward" className="text-2xl text-grey-lighter" />
        </Button>
      </div>
      <ul
        className="flex flex-col gap-5 overflow-y-auto max-h-40 scrollbar-hide mask-linear-[to_bottom,#000_60%,#0001_100%] pb-10"
        data-lenis-prevent
      >
        {projects.map((project) => (
          <li key={project.id} className="flex items-start gap-4">
            <Image
              src={project.image.url}
              alt={project.title}
              width={200}
              height={200}
              className="w-36 rounded-lg aspect-video object-cover"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-xs text-justify line-clamp-3 text-ellipsis">
                {project.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
