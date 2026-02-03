import { getPayload } from "payload";
import config from "@payload-config";
import Card from "@/components/Card";
import Marquee from "@/components/Marquee";
import FigmaEditCard from "@/components/FigmaEditCard";
import Cursor from "@/components/Cursor";

export default async function Home() {
  const payload = await getPayload({ config });
  const tags = await payload.find({
    collection: "tags" as any,
  });

  const tagsItems = tags.docs.map((tag: any) => (
    <Card key={tag.id} className="text-nowrap px-4 py-2 text-grey-base text-xs">
      {tag.name}
    </Card>
  ));

  return (
    <div className="min-h-screen pt-48">
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
    </div>
  );
}
