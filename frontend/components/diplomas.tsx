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
    img: "/softwares/Ai.svg",
    title: "Illustrator",
    mastery: 75,
  },
  {
    img: "/softwares/Ps.svg",
    title: "Photoshop",
    mastery: 75,
  },
  {
    img: "/softwares/Ae.svg",
    title: "After Effects",
    mastery: 25,
  },
  {
    img: "/softwares/Xd.svg",
    title: "Adobe XD",
    mastery: 45,
  },
  {
    img: "/softwares/Id.svg",
    title: "In Design",
    mastery: 50,
  },
  {
    img: "/softwares/Pr.svg",
    title: "Première Pro",
    mastery: 25,
  },
  {
    img: "/softwares/Vsc.svg",
    title: "Visual Studio Code",
    mastery: 50,
  },
  {
    img: "/softwares/Bl.svg",
    title: "Blender",
    mastery: 25,
  },
  {
    img: "/softwares/Fi.svg",
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

const hobbies = [
  {
    img: "/hobbies/harpe.jpg",
    title: "Instrument",
    description: "Harpe (14 ans)",
  },
  {
    img: "/hobbies/batterie.jpg",
    title: "Instrument",
    description: "Percussion/batterie (3 ans)",
  },
  {
    img: "/hobbies/",
    title: "Canni-rando",
    description: "",
  },
  {
    img: "/hobbies/renfo.jpg",
    title: "Renforcement musculaire",
    description: "Pendant 5 ans",
  },
  {
    img: "/hobbies/",
    title: "Autres instruments sans cours",
    description: "Flûte à bec, flute traversière, piano, guitare",
  },
];

export default function Diplomas() {
  const titleSwiperParams: SwiperOptions = {
    modules: [Autoplay],
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
  };

  const hobbySwiperParams: SwiperOptions = {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
  };

  return (
    <section className="relative flex flex-col items-center gap-12 py-16 px-8">
      <h2 className="text-7xl font-heading font-bold">
        DIPL<span className="sr-only">Ô</span>
        <div
          className="relative inline-block h-[1.6cap] w-[2.5ch] translate-y-[0.3cap] -mr-[0.4ch] bg-linear-to-r/srgb from-secondary to-primary/50 rounded-[0.65cap] before:content-['^'] before:absolute before:left-1/2 before:-translate-x-1/2 before:-top-[1.2cap] before:text-4xl"
          aria-hidden="true"
        >
          <div className="absolute inset-[0.24cap_0.28cap] bg-black rounded-[0.4cap]">
            <Swiper {...titleSwiperParams} className="h-full">
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
      <div className="grid grid-cols-2 gap-4 max-w-4xl">
        <div className="grid gap-8 bg-dark rounded-xl p-4 pb-8">
          <h3 className="text-xl font-heading font-light">LOGICIELS</h3>
          <div className="grid grid-cols-3 gap-x-6 gap-y-4 px-8 text-xs">
            {softwares.map((software, index) => (
              <div key={index} className="grid gap-2">
                <Image
                  src={software.img}
                  alt={software.title}
                  width={56}
                  height={56}
                  className="w-full h-auto"
                />
                <div className="flex flex-col items-center">
                  <h4 className="font-bold">{software.title}</h4>
                  <p>{software.mastery}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-rows-[auto_1fr] gap-4">
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
            <div className="grid">
              <Swiper {...hobbySwiperParams}>
                {hobbies.map((hobby, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative">
                      <Image
                        src={hobby.img}
                        alt={hobby.title}
                        width={200}
                        height={200}
                      />
                      <div className="absolute left-0 right-0 bottom-0 bg-dark bg-opacity-70 text-white p-2 blur-md">
                        <h4 className="text-xs">{hobby.title}</h4>
                        <p className="text-xs">{hobby.description}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
