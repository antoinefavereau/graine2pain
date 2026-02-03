"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string; // Applied to the flex container
  repeat?: number; // Amount of copies to render. 4 is usually a safe default for full coverage.
  duration?: number; // Duration of one loop cycle in seconds.
}

export default function Marquee({
  children,
  direction = "left",
  pauseOnHover = true,
  className,
  repeat = 4,
  duration = 20,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      // Reset initial position
      gsap.set(wrapper, { xPercent: 0 });

      // Calculate the movement percentage
      // We want to move by the width of ONE set of items.
      // Since we repeat the items 'repeat' times, one set is 100% / repeat.
      // Example: repeat = 4. Total width = 100% of element. One set = 25%.
      // We move from 0 to -25% (if left) or -25% to 0 (if right).
      const percentToMove = 100 / repeat;

      tweenRef.current = gsap.to(wrapper, {
        xPercent: direction === "left" ? -percentToMove : 0,
        startAt: { xPercent: direction === "left" ? 0 : -percentToMove },
        duration: duration,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: containerRef, dependencies: [direction, duration, repeat] },
  );

  const handleMouseEnter = () => {
    if (!pauseOnHover || !tweenRef.current) return;
    gsap.to(tweenRef.current, {
      timeScale: 0,
      duration: 1,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const handleMouseLeave = () => {
    if (!pauseOnHover || !tweenRef.current) return;
    gsap.to(tweenRef.current, {
      timeScale: 1,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
    });
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden w-full select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={wrapperRef} className={twMerge("flex w-fit", className)}>
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="contents">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
