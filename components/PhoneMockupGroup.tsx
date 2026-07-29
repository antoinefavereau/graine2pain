"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PhoneFrame from "@/components/PhoneFrame";
import { twMerge } from "tailwind-merge";

export interface MockupImageItem {
  id?: string;
  image?: {
    url?: string | null;
  } | null;
}

export interface PhoneMockupGroupProps {
  images: MockupImageItem[];
  title?: string;
  maxItems?: number;
  className?: string;
  animate?: boolean;
}

export default function PhoneMockupGroup({
  images,
  title = "",
  maxItems = 3,
  className,
  animate = true,
}: PhoneMockupGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = images.slice(0, maxItems).filter((item) => item?.image?.url);
  const count = items.length;

  useGSAP(
    () => {
      if (!animate || !containerRef.current) return;
      const targets = containerRef.current.querySelectorAll(".mockup-wrapper");
      if (!targets || targets.length === 0) return;

      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.fromTo(
        targets,
        {
          y: 40,
          scale: 0.9,
          xPercent: (index) => {
            if (count === 2) {
              return index === 0 ? 40 : -40;
            }
            return index === 0 ? 85 : index === 2 ? -85 : 0;
          },
          rotate: 0,
        },
        {
          y: 0,
          scale: 1,
          xPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    },
    { scope: containerRef, dependencies: [count] },
  );

  if (count === 0) return null;

  const transformsTwo = [
    "rotate(-2deg) translateX(15%)",
    "rotate(2deg) translateX(-15%)",
  ];
  const zIndicesTwo = [2, 1];

  const transformsThree = [
    "rotate(-4deg) translateX(15%)",
    "rotate(0deg) translateY(-3%)",
    "rotate(4deg) translateX(-15%)",
  ];
  const zIndicesThree = [3, 2, 1];

  const transforms = count === 2 ? transformsTwo : transformsThree;
  const zIndices = count === 2 ? zIndicesTwo : zIndicesThree;

  return (
    <div
      ref={containerRef}
      style={{ opacity: animate ? 0 : 1 }}
      className={twMerge("flex items-center justify-center h-full", className)}
    >
      {items.map((item, i) => (
        <div
          key={item.id ?? i}
          className="relative shrink-0 h-full"
          style={{
            transform: transforms[i] ?? "none",
            zIndex: zIndices[i] ?? 1,
          }}
        >
          <PhoneFrame
            src={item.image!.url!}
            alt={title}
            className="mockup-wrapper h-full will-change-transform"
          />
        </div>
      ))}
    </div>
  );
}
