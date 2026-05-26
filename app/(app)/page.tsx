import { getPayload } from "payload";
import config from "@payload-config";
import HomeClient from "@/components/home/Home";

export default async function Home() {
  const payload = await getPayload({ config });

  const tags = await payload.find({
    collection: "tags" as any,
  });

  const projects = await payload.find({
    collection: "projects" as any,
    sort: "order",
  });

  const recommandations = await payload.find({
    collection: "recommandations" as any,
    sort: "order",
  });

  const infos = await payload.find({
    collection: "info" as any,
    sort: "order",
  });

  return (
    <HomeClient
      tags={tags.docs}
      infos={infos.docs}
      recommandations={recommandations.docs}
      projects={projects.docs}
    />
  );
}
