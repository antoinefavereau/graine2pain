import { getPayload } from "payload";
import config from "@payload-config";
import HomeClient from "@/components/home/Home";
import { safePayloadFind } from "@/lib/payload";

export default async function Home() {
  const payload = await getPayload({ config });

  const [projects, recommandations, infos] = await Promise.all([
    safePayloadFind(
      payload,
      {
        collection: "projects" as any,
        sort: "order",
      },
      "projects",
    ),
    safePayloadFind(
      payload,
      {
        collection: "recommandations" as any,
        sort: "order",
      },
      "recommandations",
    ),
    safePayloadFind(
      payload,
      {
        collection: "info" as any,
        sort: "order",
      },
      "info",
    ),
  ]);

  return (
    <HomeClient
      infos={infos.docs}
      recommandations={recommandations.docs}
      projects={projects.docs}
    />
  );
}
