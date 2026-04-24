import { getPayload } from "payload";
import config from "@payload-config";
import Card from "@/components/Card";
import Marquee from "@/components/Marquee";
import FigmaEditCard from "@/components/FigmaEditCard";
import Cursor from "@/components/Cursor";
import InfosCard from "@/components/home/InfosCard";
import RecommandationsCard from "@/components/home/RecommandationsCard";
import ProjectsCard from "@/components/home/ProjectsCard";
import Orb from "@/components/Orb";

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
    <div className="relative min-h-screen pt-36 pb-10 flex flex-col justify-between gap-16">
      <Orb />
      <div className="flex flex-col gap-12">
        <Marquee direction="left">{tagsItems}</Marquee>
        <FigmaEditCard className="self-center">
          <h1 className="text-7xl font-extralight text-center">
            Bienvenue dans mon{" "}
            <span className="font-normal bg-linear-to-r from-secondary-base to-primary-base bg-clip-text text-transparent">
              portfolio
            </span>
          </h1>
          <Cursor
            title="Moreau Athéna"
            className="absolute bottom-[-20px] right-[80px]"
          />
        </FigmaEditCard>
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
