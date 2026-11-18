"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import AboutHero from "@/components/about/AboutHero";
import AboutHardSkills from "@/components/about/AboutHardSkills";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const t = useTranslations("About");
  const rootRef = useRef<HTMLDivElement>(null);
  const athenaRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const athena = athenaRef.current;
      const section2 = section2Ref.current;
      if (!athena || !section2) return;

      // Position de départ dans le Hero (décalée sur la droite)
      const getInitialX = () => {
        if (window.innerWidth >= 1024) return "24.5vw";
        return "22vw";
      };

      gsap.set(athena, {
        x: getInitialX,
        scale: 1,
        height: "70dvh",
        opacity: 1,
        force3D: true,
      });

      // Scrub progressif au scroll entre Section 1 (Hero) et Section 2 (Hard Skills)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section2,
          scroller: document.body,
          start: "top bottom",
          end: "top top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      scrollTl.fromTo(
        athena,
        {
          x: getInitialX,
          scale: 1,
          height: "70dvh",
        },
        {
          x: 0, // Se déplace au centre horizontal
          scale: 3.2, // Zoome pour couper l'image au niveau des coudes
          height: "60dvh", // Hauteur ajustée à 60dvh sur la section 2
          ease: "none",
        },
      );

      // Disparition douce lors de la sortie de la Section 2 vers le Footer
      gsap.to(athena, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section2,
          scroller: document.body,
          start: "bottom 35%",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative w-full">
      {/* ── Illustration 3D d'Athéna (Partagée & animée au scroll) ── */}
      <div
        ref={athenaRef}
        className="fixed bottom-[8vh] left-0 select-none pointer-events-none z-10 w-full h-[70dvh] will-change-transform translate-x-[22vw] lg:translate-x-[24.5vw]"
        style={{
          transformOrigin: "50% 5%",
        }}
      >
        <Image
          src="/images/athena-3d.png"
          alt={t("avatarAlt")}
          fill
          priority
          sizes="(max-width: 768px) 280px, 320px"
          className="object-contain object-bottom"
        />
      </div>

      {/* ── Section 1 : Hero ── */}
      <AboutHero />

      {/* ── Section 2 : Hard Skills (100dvh) ── */}
      <AboutHardSkills ref={section2Ref} />
    </div>
  );
}
