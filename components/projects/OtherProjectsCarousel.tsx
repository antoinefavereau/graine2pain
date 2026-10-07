"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import ProjectCard from "@/components/projects/ProjectCard";
import ScrollTypewriter from "@/components/ScrollTypewriter";
import type { Project } from "@/types/Project";

interface OtherProjectsCarouselProps {
  projects: Project[];
}

export default function OtherProjectsCarousel({
  projects,
}: OtherProjectsCarouselProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);
  const lastDeltaRef = useRef(0);

  // Duplicate project array to form seamless infinite loops
  const displayProjects = [...projects, ...projects, ...projects, ...projects];

  useGSAP(
    () => {
      if (!trackRef.current) return;
      const track = trackRef.current;

      // Initialize positions
      currentScrollRef.current = track.scrollLeft;
      targetScrollRef.current = track.scrollLeft;

      const tickerFunc = () => {
        const singleSetWidth = track.scrollWidth / 4;
        if (singleSetWidth <= 0) return;

        // Smooth lerp (linear interpolation) for progressive fluid motion
        const diff = targetScrollRef.current - currentScrollRef.current;
        if (Math.abs(diff) > 0.05) {
          currentScrollRef.current += diff * 0.12;

          // Infinite wrap bounds
          if (currentScrollRef.current >= singleSetWidth * 2) {
            currentScrollRef.current -= singleSetWidth;
            targetScrollRef.current -= singleSetWidth;
            if (snapTweenRef.current) {
              snapTweenRef.current.kill();
              snapTweenRef.current = null;
            }
          } else if (
            currentScrollRef.current <= 0 &&
            targetScrollRef.current < 0
          ) {
            currentScrollRef.current += singleSetWidth;
            targetScrollRef.current += singleSetWidth;
            if (snapTweenRef.current) {
              snapTweenRef.current.kill();
              snapTweenRef.current = null;
            }
          }

          track.scrollLeft = currentScrollRef.current;
        }
      };

      gsap.ticker.add(tickerFunc);

      return () => {
        gsap.ticker.remove(tickerFunc);
        if (snapTweenRef.current) {
          snapTweenRef.current.kill();
          snapTweenRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [projects] },
  );

  const scheduleSnap = () => {
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      if (!trackRef.current) return;
      const cardEl = trackRef.current.firstElementChild as HTMLElement | null;
      if (!cardEl) return;
      // card width + gap (24px)
      const step = cardEl.getBoundingClientRect().width + 24;
      if (step <= 0) return;

      const singleSetWidth = trackRef.current.scrollWidth / 4;
      if (singleSetWidth > 0 && targetScrollRef.current >= singleSetWidth * 2) {
        targetScrollRef.current -= singleSetWidth;
        currentScrollRef.current -= singleSetWidth;
        trackRef.current.scrollLeft = currentScrollRef.current;
      }

      const currentTarget = targetScrollRef.current;
      const cardIndexFloat = currentTarget / step;
      const direction = lastDeltaRef.current;

      let nearestIndex: number;

      if (direction > 0) {
        // En scroll vers l'avant : une avancée intentionnelle (> 8% de la carte) valide le passage à la carte suivante
        const baseIndex = Math.floor(cardIndexFloat);
        const progress = cardIndexFloat - baseIndex;
        if (progress > 0.08) {
          nearestIndex = baseIndex + 1;
        } else {
          nearestIndex = baseIndex;
        }
      } else if (direction < 0) {
        // En scroll vers l'arrière : recul intentionnel vers la carte précédente
        const baseIndex = Math.floor(cardIndexFloat);
        const progress = cardIndexFloat - baseIndex;
        if (progress < 0.92) {
          nearestIndex = baseIndex;
        } else {
          nearestIndex = baseIndex + 1;
        }
      } else {
        nearestIndex = Math.round(cardIndexFloat);
      }

      if (nearestIndex < 0) nearestIndex = 0;

      const nearest = nearestIndex * step;
      const dist = Math.abs(nearest - currentTarget);

      if (dist < 1) return;

      // Transition progressive et douce vers la carte ciblée (évite le à-coup violent)
      const duration = gsap.utils.clamp(0.4, 0.75, dist / 250);

      snapTweenRef.current?.kill();
      snapTweenRef.current = gsap.to(targetScrollRef, {
        current: nearest,
        duration,
        ease: "power2.out",
      });
    }, 220);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current || !trackRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isSectionVisible = rect.top < window.innerHeight && rect.bottom > 0;

      // Intercept wheel as soon as the section enters the viewport.
      if (isSectionVisible) {
        if (e.deltaY > 0) {
          e.preventDefault();
          lastDeltaRef.current = e.deltaY;
          if (snapTweenRef.current) {
            snapTweenRef.current.kill();
            snapTweenRef.current = null;
          }
          targetScrollRef.current += e.deltaY * 0.8;
          scheduleSnap();
        } else if (e.deltaY < 0 && targetScrollRef.current > 10) {
          e.preventDefault();
          lastDeltaRef.current = e.deltaY;
          if (snapTweenRef.current) {
            snapTweenRef.current.kill();
            snapTweenRef.current = null;
          }
          targetScrollRef.current += e.deltaY * 0.8;
          if (targetScrollRef.current < 0) {
            targetScrollRef.current = 0;
          }
          scheduleSnap();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      if (snapTweenRef.current) {
        snapTweenRef.current.kill();
        snapTweenRef.current = null;
      }
    };
  }, []);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="p-6 py-16 md:p-16 lg:p-28 xl:p-48 flex flex-col gap-6 md:gap-10 overflow-hidden"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal">
        <ScrollTypewriter start="top 85%" end="top 60%">
          On continue ?
        </ScrollTypewriter>
      </h2>

      <div
        ref={trackRef}
        className="w-full overflow-x-hidden scrollbar-hide flex gap-6 pe-12 mask-linear-[to_right,#000_80%,#0001_100%]"
      >
        {displayProjects.map((project, i) => (
          <div
            key={`${project.id}-${i}`}
            className="shrink-0 w-[min(350px,80vw)]"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
