"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";

import BacklightTitle from "@/components/about/BacklightTitle";
import Card from "@/components/Card";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";

export default function AboutHero() {
  const t = useTranslations("About");
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animation d'entrée de la Card amenée par la souris d'Athéna
      if (cardRef.current && cursorRef.current) {
        const card = cardRef.current;
        const cursor = cursorRef.current;

        const tl = gsap.timeline({
          delay: 0.35,
          defaults: { ease: "power2.out" },
        });

        // 1. État initial : la Card est décalée et inclinée vers le bas-droite
        tl.set(card, {
          x: 180,
          y: 130,
          rotation: 5,
          scale: 0.92,
          opacity: 0,
          transformOrigin: "top right",
        });

        // Le curseur démarre hors écran à droite
        tl.set(cursor, {
          x: 450,
          y: 150,
          scale: 1,
          rotation: -5,
        });

        // 2. Le curseur arrive sur le coin supérieur droit de la Card
        tl.to(cursor, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: -5,
          duration: 0.55,
          ease: "power2.out",
        });

        // 3. Le curseur "attrape" le bord de la Card (léger squeeze)
        tl.to(cursor, {
          scale: 0.86,
          rotation: -5,
          duration: 0.12,
        });

        // 4. Le curseur tire la Card vers sa place finale (la Card se redresse à 0deg)
        tl.to(
          card,
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: "power2.out",
          },
          "-=0.04",
        );

        tl.to(
          cursor,
          {
            rotation: 0,
            scale: 1,
            duration: 0.85,
            ease: "power2.out",
          },
          "<",
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-dvh flex flex-col justify-center items-start gap-2 md:gap-4 px-6 sm:px-10 lg:px-14 py-8 md:py-16"
    >
      <Navbar className="absolute top-0 left-0 w-full" />
      <BacklightTitle />
      <p className="text-xl sm:text-2xl md:text-3xl text-grey-base">
        {t("role")}
      </p>

      {/* Card superposée en bas d'Athéna */}
      <div
        ref={cardRef}
        className="absolute bottom-12 sm:bottom-16 ms-4 right-4 sm:right-12 md:right-16 lg:right-28 max-w-sm sm:max-w-md lg:max-w-lg will-change-transform z-20"
      >
        <Card className="p-6 flex flex-col gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-grey-lighter">
            {t("introTitle")}
          </h3>
          <p className="text-sm sm:text-base text-grey-lighter font-extralight">
            {t.rich("introText", {
              bold: (chunks) => <strong className="font-bold">{chunks}</strong>,
            })}
          </p>

          {/* Curseur Figma avec la main et le tag Moreau Athéna */}
          <div
            ref={cursorRef}
            className="absolute top-5 right-24 md:right-16 lg:right-8 z-30 pointer-events-none will-change-transform"
          >
            <Cursor title="Moreau Athéna" />
          </div>
        </Card>
      </div>
    </section>
  );
}
