import { getPayload } from "payload";
import config from "@payload-config";
import Card from "@/components/Card";
import Marquee from "@/components/Marquee";
import InfosCard from "@/components/home/InfosCard";
import RecommandationsCard from "@/components/home/RecommandationsCard";
import ProjectsCard from "@/components/home/ProjectsCard";
import Orb from "@/components/Orb";
import HeroIntro from "@/components/home/HeroIntro";

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

  const tagsItems = tags.docs.map((tag: any) => (
    <Card
      key={tag.id}
      className="text-nowrap px-3 py-1.5 text-grey-base text-xs"
    >
      {tag.name}
    </Card>
  ));

  return (
    <div className="relative min-h-screen pt-36 pb-10 flex flex-col justify-between gap-16 bg-black">
      <Orb />
      <div className="flex flex-col gap-12">
        <Marquee direction="left">{tagsItems}</Marquee>
        <HeroIntro />
        <Marquee direction="right">{tagsItems}</Marquee>
      </div>
      <div className="relative grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 self-center px-10">
        <div className="col-span-1 lg:col-span-2 xl:col-span-1">
          <InfosCard />
        </div>
        <RecommandationsCard recommandations={recommandations.docs} />
        <ProjectsCard projects={projects.docs} />
      </div>
    </div>
  );
}
