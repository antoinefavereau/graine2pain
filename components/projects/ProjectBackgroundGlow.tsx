"use client";

import { ReactNode, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProjectBackgroundGlowProps {
  children: ReactNode;
}

export default function ProjectBackgroundGlow({
  children,
}: ProjectBackgroundGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowWrapperRef = useRef<HTMLDivElement>(null);
  const primaryLayerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !glowWrapperRef.current ||
        !primaryLayerRef.current
      ) {
        return;
      }

      const container = containerRef.current;
      const glow = glowWrapperRef.current;
      const primaryLayer = primaryLayerRef.current;
      const sections = Array.from(container.querySelectorAll("section"));

      // Initial GPU positions
      gsap.set(glow, { y: 0, yPercent: -50, force3D: true });
      gsap.set(primaryLayer, { opacity: 0, force3D: true });

      const totalScroll = container.scrollHeight - window.innerHeight;

      // Calculate progress points for each section center
      let progressPoints: number[] = [];
      if (sections.length > 1 && totalScroll > 0) {
        progressPoints = sections.map((sec, idx) => {
          if (idx === 0) return 0;
          if (idx === sections.length - 1) return 1;
          const sectionCenter = sec.offsetTop + sec.offsetHeight / 2;
          const targetScroll = sectionCenter - window.innerHeight / 2;
          return Math.max(0, Math.min(1, targetScroll / totalScroll));
        });

        // Ensure strictly increasing progression
        for (let i = 1; i < progressPoints.length; i++) {
          if (progressPoints[i] <= progressPoints[i - 1]) {
            progressPoints[i] = Math.min(
              1,
              progressPoints[i - 1] + 1 / (sections.length * 2),
            );
          }
        }
        progressPoints[0] = 0;
        progressPoints[progressPoints.length - 1] = 1;
      } else if (sections.length > 1) {
        progressPoints = sections.map((_, i) => i / (sections.length - 1));
      } else {
        progressPoints = [0, 1];
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scroller: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      // 1. Move glow vertically: starts centered at top (y=0), ends centered at bottom (y=window.innerHeight)
      tl.fromTo(
        glow,
        { y: 0, yPercent: -50 },
        {
          y: () => window.innerHeight,
          yPercent: -50,
          duration: 1,
          ease: "none",
        },
        0,
      );

      // 2. Hardware-accelerated opacity crossfade between secondary and primary
      for (let i = 0; i < progressPoints.length - 1; i++) {
        const startP = progressPoints[i];
        const endP = progressPoints[i + 1];
        // Odd sections = Primary (opacity 1), Even sections = Secondary (opacity 0)
        const targetOpacity = (i + 1) % 2 === 1 ? 1 : 0;
        const duration = Math.max(0.01, endP - startP);

        tl.to(
          primaryLayer,
          {
            opacity: targetOpacity,
            duration,
            ease: "power1.inOut",
          },
          startP,
        );
      }

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      return () => {
        clearTimeout(timer);
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="relative isolate w-full min-h-screen">
      {/* Background Glow Container */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
        style={{ contain: "strict" }}
      >
        <div
          ref={glowWrapperRef}
          className="absolute left-1/2 -translate-x-1/2 w-[40vh] h-[40vh] pointer-events-none blur-[40vh] will-change-transform"
        >
          {/* Secondary Layer (Base #9B6BFF) */}
          <div className="absolute inset-0 rounded-full bg-secondary-base" />

          {/* Primary Layer (Crossfaded #3DDC97) */}
          <div
            ref={primaryLayerRef}
            className="absolute inset-0 rounded-full  bg-primary-base will-change-opacity"
          />
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
