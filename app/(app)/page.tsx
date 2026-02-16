import { getPayload } from "payload";
import config from "@payload-config";
import Card from "@/components/Card";
import Marquee from "@/components/Marquee";
import FigmaEditCard from "@/components/FigmaEditCard";
import Cursor from "@/components/Cursor";
import InfosCard from "@/components/home/InfosCard";
import RecommandationsCard from "@/components/home/RecommandationsCard";
import ProjectsCard from "@/components/home/ProjectsCard";
// import Spline from "@splinetool/react-spline/next";
// import CloudBackground from "@/components/CloudBackground";

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
    <Card key={tag.id} className="text-nowrap px-4 py-2 text-grey-base text-xs">
      {tag.name}
    </Card>
  ));

  return (
    <div className="relative min-h-screen pt-48 pb-10 flex flex-col justify-between gap-20">
      {/* <Spline
        scene="https://prod.spline.design/pBFDqKeRoRidMcD9/scene.splinecode"
        className="absolute top-0 left-0 w-full h-full -z-10"
      /> */}
      {/* <CloudBackground /> */}
      <div className="flex flex-col gap-20">
        <Marquee direction="left" className="gap-6">
          {tagsItems}
        </Marquee>
        <FigmaEditCard className="self-center">
          <h1 className="text-8xl font-extralight text-center">
            Bienvenue dans mon{" "}
            <span className="font-normal bg-linear-to-r from-secondary-base to-primary-base bg-clip-text text-transparent">
              portfolio
            </span>
          </h1>
          <Cursor
            title="Moreau Athéna"
            className="absolute bottom-[-20px] right-[100px]"
          />
        </FigmaEditCard>
        <Marquee direction="right" className="gap-6">
          {tagsItems}
        </Marquee>
      </div>
      <div className="relative flex justify-between gap-10 self-center px-10">
        <InfosCard />
        <RecommandationsCard recommandations={recommandations.docs} />
        <ProjectsCard projects={projects.docs} />
      </div>
    </div>
  );
}
