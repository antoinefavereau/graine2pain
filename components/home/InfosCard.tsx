"use client";

import Image from "next/image";
import { forwardRef } from "react";

import { Fragment } from "react/jsx-runtime";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import type { Info } from "@/payload-types";

interface InfosCardProps {
  infos: Info[];
}

const InfosCard = forwardRef<HTMLDivElement, InfosCardProps>(function InfosCard(
  { infos },
  ref,
) {
  return (
    <Card ref={ref} isRefractive className="flex flex-col gap-5 p-5">
      <div className="flex items-start gap-6">
        <Button variant="outline" color="grey" onlyIcon href="/about">
          <Icon name="arrow_outward" />
        </Button>
        <div className="relative flex-1 h-16 bg-linear-to-r from-secondary-base/50 to-primary-base/50 rounded-3xl">
          <Image
            src="/avatar.png"
            alt="Athena"
            width={100}
            height={100}
            className="absolute -bottom-1 right-8 select-none w-24 h-auto"
          />
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {infos.map((info, index) => (
          <Fragment key={info.id || index}>
            <li className="flex justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <Icon name={info.icone || ""} className="font-light!" />
                <p className="font-semibold">{info.titre}</p>
              </div>
              <p className="text-sm font-light">{info.valeur}</p>
            </li>
            {index < infos.length - 1 && <hr className="border-grey-medium" />}
          </Fragment>
        ))}
      </ul>
    </Card>
  );
});

export default InfosCard;
