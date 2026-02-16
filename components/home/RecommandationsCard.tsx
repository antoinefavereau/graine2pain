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
    <div className="relative max-w-md flex flex-col gap-6 p-6 bg-grey-dark rounded-3xl">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl,
          nextEl,
        }}
        loop
        className="w-full flex-1"
      >
        {recommandations.map((recommandation) => (
          <SwiperSlide key={recommandation.id}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-5">
                <Image
                  src={recommandation.image.url}
                  alt={recommandation.nom}
                  width={100}
                  height={100}
                  className="w-14 h-14 rounded-full"
                />
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold">{recommandation.nom}</h3>
                  <p className="text-gray-light">{recommandation.fonction}</p>
                </div>
              </div>
              <p className="text-2xl">{recommandation.message}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex justify-between items-center gap-6">
        <Button variant="outline" color="grey">
          Voir la lettre complète
        </Button>
        <div className="flex gap-6">
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
