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

const softwares = [
  {
    img: "/software/illustrator.svg",
    title: "Illustrator",
    mastery: 75,
  },
  {
    img: "/software/photoshop.svg",
    title: "Photoshop",
    mastery: 75,
  },
  {
    img: "/software/after-effects.svg",
    title: "After Effects",
    mastery: 25,
  },
  {
    img: "/software/adobe-xd.svg",
    title: "Adobe XD",
    mastery: 45,
  },
  {
    img: "/software/in-design.svg",
    title: "In Design",
    mastery: 50,
  },
  {
    img: "/software/premiere-pro.svg",
    title: "Première Pro",
    mastery: 25,
  },
  {
    img: "/software/visual-studio-code.svg",
    title: "Visual Studio Code",
    mastery: 50,
  },
  {
    img: "/software/blender.svg",
    title: "Blender",
    mastery: 25,
  },
  {
    img: "/software/figma.svg",
    title: "Figma",
    mastery: 95,
  },
];

const languages = [
  {
    img: "/languages/anglais.svg",
    title: "Anglais : B1",
    level: "niveau : indépendant",
  },
  {
    img: "/languages/allemand.svg",
    title: "Allemand : B1",
    level: "niveau : indépendant",
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
    <section className="relative flex flex-col items-center gap-8 p-8">
      <h2 className="text-7xl font-heading font-bold">
        DIPL<span className="sr-only">Ô</span>
        <div
          className="relative inline-block h-[1.6cap] w-[2.5ch] translate-y-[0.3cap] -mr-[0.4ch] bg-linear-to-r/srgb from-secondary to-primary/50 rounded-[0.65cap] before:content-['^'] before:absolute before:left-1/2 before:-translate-x-1/2 before:-top-[1.2cap] before:text-4xl"
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
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-8 bg-dark rounded-xl p-4">
          <h3 className="text-xl font-heading font-light">LOGICIELS</h3>
          <div className="grid grid-cols-3">
            {softwares.map((software, index) => (
              <div key={index} className="flex flex-col items-center">
                <p>{software.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-rows-[auto_1fr]">
          <div className="grid gap-8 bg-dark rounded-xl p-4">
            <h3 className="text-xl font-heading font-light">LANGUES</h3>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((language, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Image
                    src={language.img}
                    alt={language.title}
                    width={56}
                    height={56}
                    className="h-6 w-auto"
                  />
                  <div className="flex flex-col">
                    <h4 className="text-xs">{language.title}</h4>
                    <p className="text-xs">{language.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-8 bg-dark rounded-xl p-4">
            <h3 className="text-xl font-heading font-light">
              ACTIVITÉS EXTRASCOLAIRES
            </h3>
            <div className=""></div>
          </div>
        </div>
      </div>
    </section>
  );
}
