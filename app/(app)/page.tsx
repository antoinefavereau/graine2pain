import { getPayload } from "payload";
import config from "@payload-config";
import HomeClient from "@/components/home/Home";
import { safePayloadFind } from "@/lib/payload";
import { getLocale } from "next-intl/server";

export default async function Home() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const [projects, recommandations, infos] = await Promise.all([
    safePayloadFind(
      payload,
      {
        collection: "projects" as any,
        sort: "order",
        locale: locale as any,
      },
      "projects",
    ),
    safePayloadFind(
      payload,
      {
        collection: "recommandations" as any,
        sort: "order",
        locale: locale as any,
      },
      "recommandations",
    ),
    safePayloadFind(
      payload,
      {
        collection: "info" as any,
        sort: "order",
        locale: locale as any,
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
