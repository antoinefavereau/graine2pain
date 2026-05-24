"use client";

import { useState } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import Button from "@/components/Button";
import Icon from "@/components/Icon";

import "swiper/css";
import "swiper/css/navigation";

interface Recommandation {
  id: string;
  nom: string;
  fonction: string;
  message: string;
  image: {
    url: string;
  };
}

interface RecommandationsCardProps {
  recommandations: Recommandation[];
}

export default function RecommandationsCard({
  recommandations,
}: RecommandationsCardProps) {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  return (
    <div className="relative grid grid-rows-[1fr_auto] gap-5 p-5 bg-grey-dark rounded-[20px]">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl,
          nextEl,
        }}
        loop
        className="w-full"
      >
        {recommandations.map((recommandation) => (
          <SwiperSlide key={recommandation.id}>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-5">
                <Image
                  src={recommandation.image.url}
                  alt={recommandation.nom}
                  width={100}
                  height={100}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold uppercase">
                    {recommandation.nom}
                  </h3>
                  <p className="text-gray-light text-sm font-light text-balance">
                    {recommandation.fonction}
                  </p>
                </div>
              </div>
              <p className="text-xl text-justify line-clamp-4 text-ellipsis">
                {recommandation.message}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex justify-between items-center gap-5">
        <Button variant="outline" color="grey">
          Voir la lettre complète
        </Button>
        <div className="flex gap-5">
          <Button ref={setPrevEl} variant="outline" color="grey" onlyIcon>
            <Icon name="arrow_back_ios_new" />
          </Button>
          <Button ref={setNextEl} variant="outline" color="grey" onlyIcon>
            <Icon name="arrow_forward_ios" />
          </Button>
        </div>
      </div>
    </div>
  );
}
