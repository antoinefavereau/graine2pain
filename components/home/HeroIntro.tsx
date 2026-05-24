"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import FigmaEditCard from "@/components/FigmaEditCard";
import Cursor from "@/components/Cursor";

const HERO_TEXT = "Bienvenue dans mon portfolio";
const HERO_PREFIX = "Bienvenue dans mon ";
const HERO_ACCENT = "portfolio";

export default function HeroIntro() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const cursorWrapperRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState("");

  useLayoutEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
    const heroElement = heroRef.current;
    const cursorElement = cursorWrapperRef.current;
    const cardElement = cardWrapperRef.current;

    if (!heroElement || !cursorElement || !cardElement) {
      return;
    }

    const heroRect = heroElement.getBoundingClientRect();
    const cursorRect = cursorElement.getBoundingClientRect();
    const startLeft = heroRect.width - 160 - cursorRect.width;
    const startTop = heroRect.height - cursorRect.height;
    const finalLeft = (heroRect.width - cursorRect.width) / 2;
    const finalTop = (heroRect.height - cursorRect.height) / 2;
    const cursorDeltaX = finalLeft - startLeft;
    const cursorDeltaY = finalTop - startTop;

    timeline.set(cardElement, { opacity: 0 });
    timeline.set(cursorElement, {
      opacity: 0,
      scale: 0.85,
      x: 0,
      y: 0,
    });

    timeline.to(cursorElement, {
      opacity: 1,
      scale: 1,
      duration: 0.18,
    });

    timeline.to(cursorElement, {
      x: cursorDeltaX,
      y: cursorDeltaY,
      duration: 0.8,
    });

    timeline.to(cursorElement, {
      scale: 0.9,
      duration: 0.08,
    });

    timeline.to(cursorElement, {
      scale: 1,
      duration: 0.08,
    });

    timeline.to(
      cardElement,
      {
        opacity: 1,
        duration: 0.45,
      },
      "-=0.2",
    );

    timeline.add(() => setDisplayedText(""), "+=0.12");

    HERO_TEXT.split("").forEach((_, index) => {
      timeline.add(() => {
        setDisplayedText(HERO_TEXT.slice(0, index + 1));
      }, "+=0.05");
    });

    timeline.to(cursorElement, {
      x: 0,
      y: 0,
      duration: 0.85,
    });

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div ref={heroRef} className="relative flex justify-center px-5">
      <div ref={cardWrapperRef} className="will-change-transform">
        <FigmaEditCard className="self-center">
          <h1 className="text-7xl font-extralight text-center">
            {displayedText.length === 0 && (
              <span
                aria-hidden="true"
                className="pointer-events-none select-none opacity-0"
              >
                p
              </span>
            )}
            {displayedText.slice(0, HERO_PREFIX.length)}
            {displayedText.length > HERO_PREFIX.length && (
              <span className="font-normal bg-linear-to-r from-secondary-base to-primary-base bg-clip-text text-transparent">
                {displayedText.slice(
                  HERO_PREFIX.length,
                  HERO_PREFIX.length + HERO_ACCENT.length,
                )}
              </span>
            )}
          </h1>
        </FigmaEditCard>
      </div>

      <div
        ref={cursorWrapperRef}
        className="absolute bottom-0 right-40 will-change-transform"
      >
        <Cursor title="Moreau Athéna" />
      </div>
    </div>
  );
}
