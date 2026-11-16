import { getPayload } from "payload";
import config from "@payload-config";
import type { Project } from "@/types/Project";
import BlockRenderer from "@/components/projects/blocks/BlockRenderer";
import ProjectHero from "@/components/projects/ProjectHero";
import OtherProjectsCarousel from "@/components/projects/OtherProjectsCarousel";
import ProjectBackgroundGlow from "@/components/projects/ProjectBackgroundGlow";
import { safePayloadFind } from "@/lib/payload";
import Footer from "@/components/Footer";
import { getLocale } from "next-intl/server";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const [projectRes, allProjectsRes] = await Promise.all([
    payload.findByID({
      collection: "projects" as any,
      id,
      locale: locale as any,
    }),
    safePayloadFind(
      payload,
      {
        collection: "projects" as any,
        sort: "order",
        locale: locale as any,
      },
      "projects",
    ),
  ]);

  const project = projectRes as Project;
  const otherProjects = (allProjectsRes.docs as unknown as Project[]).filter(
    (p) => String(p.id) !== String(id),
  );

  return (
    <ProjectBackgroundGlow>
      <ProjectHero project={project} />
      {project.blocks &&
        project.blocks.length > 0 &&
        project.blocks.map((block, i) => (
          <BlockRenderer key={block.id ?? i} block={block} />
        ))}
      <OtherProjectsCarousel projects={otherProjects} />
      <Footer />
    </ProjectBackgroundGlow>
  );
}
