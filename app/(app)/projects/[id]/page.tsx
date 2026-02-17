import { getPayload } from "payload";
import config from "@payload-config";
import type { Project } from "@/types/Project";

export default async function Project({
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
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-7xl font-bold">Projet "{project.title}"</h1>
      <p className="text-2xl font-light">Page bientôt disponible...</p>
    </div>
  );
}
