"use client";

import { SwiperOptions } from "swiper/types";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

const diplomas = [
  {
    img: "/diplomas/permis.svg",
    title: "Permis B1 & AM",
  },
  {
    img: "/diplomas/brevet solfege.svg",
    title: "Brevet Solfège",
  },
  {
    img: "/diplomas/bac std2a.svg",
    title: "BAC STD2A",
  },
  {
    img: "/diplomas/licence.svg",
    title: "Licence DN MADE",
  },
];

export default function Diplomas() {
  const swiperParams: SwiperOptions = {
    modules: [Autoplay],
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
  };

  return (
    <section className="relative flex flex-col items-center gap-4 p-8">
      <h2 className="text-7xl font-heading font-bold">
        DIPL<span className="sr-only">Ô</span>
        <div
          className="relative inline-block h-[1.6cap] w-[2.5ch] translate-y-[0.3cap] -mr-[0.4ch] bg-linear-to-r/srgb from-secondary to-primary/50 rounded-[0.65cap] before:content-['^'] before:absolute before:left-1/2 before:-translate-x-1/2 before:-top-[1cap]"
          aria-hidden="true"
        >
          <div className="absolute inset-[0.24cap_0.28cap] bg-black rounded-[0.4cap]">
            <Swiper {...swiperParams} className="h-full">
              {diplomas.map((diploma, index) => (
                <SwiperSlide
                  key={index}
                  className="flex! flex-col justify-center items-center text-center"
                >
                  <Image
                    src={diploma.img}
                    alt={diploma.title}
                    width={56}
                    height={56}
                    className="h-6 w-auto"
                  />
                  <h4 className="text-xs">{diploma.title}</h4>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <span className="relative">MES</span>
      </h2>
    </section>
  );
}
