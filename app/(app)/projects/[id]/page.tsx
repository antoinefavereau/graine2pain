import { getPayload } from "payload";
import config from "@payload-config";
import type { Project } from "@/types/Project";
import BlockRenderer from "@/components/projects/blocks/BlockRenderer";
import ProjectHero from "@/components/projects/ProjectHero";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payload = await getPayload({ config });

  const project: Project = await payload.findByID({
    collection: "projects" as any,
    id,
  });

  return (
    <>
      <ProjectHero project={project} />
      {project.blocks &&
        project.blocks.length > 0 &&
        project.blocks.map((block, i) => (
          <BlockRenderer key={block.id ?? i} block={block} />
        ))}
    </>
  );
}
