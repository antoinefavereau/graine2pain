"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SplitMediaBlock as SplitMediaBlockType } from "@/types/Project";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";

import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Button from "@/components/Button";
import PhoneFrame from "@/components/PhoneFrame";
import Card from "@/components/Card";
import BlockLabel from "@/components/projects/blocks/BlockLabel";
import Cursor from "@/components/Cursor";

gsap.registerPlugin(ScrollTrigger);

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

interface SplitMediaBlockProps {
  block: SplitMediaBlockType;
}

export default function SplitMediaBlock({ block }: SplitMediaBlockProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !cardRef.current || !cursorRef.current) return;

      const card = cardRef.current;
      const cursor = cursorRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: document.body,
          start: "top 85%",
          end: "top 30%",
          scrub: 0.8,
          fastScrollEnd: true,
        },
      });

      // 1. Initial State: Card sits tilted down-right off-canvas (5 deg)
      tl.set(card, {
        x: 220,
        y: 180,
        rotation: 5,
        scale: 0.92,
        opacity: 0,
        transformOrigin: "top right",
      });

      // Cursor starts off-screen right, counter-rotated (-5 deg) so it remains 100% upright in world space!
      tl.set(cursor, {
        x: 550,
        y: 220,
        scale: 1,
        rotation: -5,
      });

      // 2. Cursor arrives at Card corner (stays upright)
      tl.to(cursor, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: -5,
        duration: 0.3,
        ease: "power2.out",
      });

      // 3. Cursor grabs Card top edge (stays upright)
      tl.to(cursor, {
        scale: 0.85,
        rotation: -5,
        duration: 0.1,
      });

      // 4. Cursor drags Card into place (Card un-tilts to 0, Cursor counter-un-tilts to 0)
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
        "-=0.05",
      );

      tl.to(
        cursor,
        {
          rotation: 0,
          duration: 0.85,
          ease: "power2.out",
        },
        "<",
      );

      // 5. Cursor releases Card & exits off-screen top-right (remains 100% upright)
      tl.to(cursor, {
        scale: 1,
        rotation: 0,
        x: 700,
        y: -150,
        duration: 0.45,
        ease: "power2.in",
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative p-4 py-12 md:p-12 lg:p-24 xl:p-40 overflow-hidden"
    >
      <div ref={cardRef} className="will-change-transform">
        <Card
          className={twMerge(
            "relative gap-8 lg:gap-12 px-4 md:px-12 py-6 md:py-8 lg:py-10",
            block.medias &&
              block.medias.length === 2 &&
              "flex flex-col-reverse lg:flex-row items-center",
            block.medias &&
              block.medias.length > 2 &&
              "grid grid-cols-1 md:grid-cols-2",
          )}
        >
          <div className="absolute inset-0 bg-linear-to-tr from-secondary-base/10 to-transparent"></div>
          {block.medias && block.medias.length === 2 && (
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {block.medias.map((item, i) => (
                <div
                  key={item.id ?? i}
                  className="flex flex-col gap-2 sm:gap-4 items-center"
                >
                  {item.image?.url && (
                    <PhoneFrame
                      src={item.image.url}
                      alt={item.image.alt}
                      className="w-auto h-[40vh]"
                    />
                  )}
                  {item.caption && (
                    <p className="text-sm sm:text-base text-secondary-light text-center">
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {block.medias && block.medias.length > 2 && (
            <div className="grid grid-cols-2 gap-4 lg:gap-6 max-md:aspect-square max-md:order-2">
              {block.medias.map((item, i) => (
                <div
                  key={item.id ?? i}
                  className={twMerge(
                    "relative rounded-2xl sm:rounded-4xl overflow-hidden",
                    block.medias?.length === 3 && i === 0 && "col-span-2",
                  )}
                >
                  {item.image?.url && (
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex-1 flex flex-col gap-2 w-full">
            <BlockLabel color="secondary">{block.label}</BlockLabel>
            <div className="flex-1 flex flex-col gap-4 lg:gap-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-grey-light">
                {block.title}
                {block.titleHighlight && (
                  <>
                    <br />
                    <span className="font-bold bg-linear-to-r from-secondary-base to-primary-base bg-clip-text text-transparent">
                      {block.titleHighlight}
                    </span>
                  </>
                )}
              </h2>

              {block.description && (
                <div className="text-xs sm:text-sm text-grey-lighter prose-strong:text-grey-lighter prose-strong:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1">
                  <RichText
                    data={block.description as SerializedEditorState}
                    converters={jsxConverters}
                  />
                </div>
              )}

              {block.ctaLabel && (
                <div className="self-start mt-2">
                  <Button
                    href={block.ctaUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    color="grey"
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      {block.ctaIcon?.url && (
                        <Image
                          src={block.ctaIcon.url}
                          alt={block.ctaIcon.alt}
                          width={16}
                          height={16}
                          className="object-contain rounded-xs"
                        />
                      )}
                    </span>
                    {block.ctaLabel}
                    <span className="material-symbols-outlined text-xl font-semibold">
                      north_east
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div
            ref={cursorRef}
            className="absolute top-4 right-6 sm:top-6 sm:right-10 z-30 pointer-events-none will-change-transform"
          >
            <Cursor title="Moreau Athéna" />
          </div>
        </Card>
      </div>
    </section>
  );
}
