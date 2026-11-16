import { getPayload } from "payload";
import config from "@payload-config";
import { safePayloadFind } from "@/lib/payload";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import { getLocale } from "next-intl/server";

export const metadata = {
  title: "Projets — Athéna Moreau",
  description: "Découvrez tous les projets de Athéna Moreau.",
};

export default async function Projects() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const projects = await safePayloadFind(
    payload,
    {
      collection: "projects" as any,
      sort: "order",
      locale: locale as any,
    },
    "projects",
  );

  return <ProjectsGrid projects={projects.docs as any} />;
}
