import Image from "next/image";

import { Fragment } from "react/jsx-runtime";
import { getPayload } from "payload";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import config from "@payload-config";

export default async function InfosCard() {
  const payload = await getPayload({ config });
  const infos = await payload.find({
    collection: "info" as any,
    sort: "order",
  });

  return (
    <Card className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-6">
        <Button variant="outline" color="grey" onlyIcon>
          <Icon name="arrow_outward" className="text-2xl text-grey-lighter" />
        </Button>
        <div className="relative flex-1 h-20 bg-linear-to-r from-secondary-base/50 to-primary-base/50 rounded-3xl">
          <Image
            src="/avatar.png"
            alt="Athena"
            width={150}
            height={150}
            className="absolute -bottom-2 right-8 select-none"
          />
        </div>
      </div>
      <ul className="flex flex-col gap-4">
        {infos.docs?.map((info, index) => (
          <Fragment key={info.id || index}>
            <li className="flex justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <Icon name={info.icone || ""} className="text-2xl" />
                <span className="text-lg font-bold">{info.titre}</span>
              </div>
              <span>{info.valeur}</span>
            </li>
            {infos.docs && index < infos.docs.length - 1 && (
              <hr className="border-grey-medium" />
            )}
          </Fragment>
        ))}
      </ul>
    </Card>
  );
}
