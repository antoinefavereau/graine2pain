"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import ProjectCard from "@/components/projects/ProjectCard";
import ScrollTypewriter from "@/components/ScrollTypewriter";
import type { Project } from "@/types/Project";

/**
 * Variables de configuration de l'arrondi et du comportement du carrousel
 * Modifiez ces valeurs pour ajuster la courbure, la vitesse et le magnétisme.
 */
export const CAROUSEL_CONFIG = {
  // Courbure & inclinaison en arc de cercle
  arc: {
    minRadius: 850, // Rayon minimal de l'arc en px (plus petit = plus arrondi/courbé)
    radiusMultiplier: 0.75, // Facteur appliqué à la largeur de l'écran (radius = max(minRadius, width * multiplier))
    maxAngle: 0.95, // Angle maximal d'inflexion (en radians, clamp)
    rotationFactor: 0.55, // Ratio de rotation des cartes (adouci pour accompagner harmonieusement la courbe)
    cullDistanceFactor: 1.25, // Facteur de distance au-delà duquel les cartes ne sont plus transformées
  },
  // Espacement & disposition
  layout: {
    cardGap: 40, // Espace entre les cartes en px (augmenté pour aérer les coins inclinés)
    edgeFadePercent: 6, // Largeur du fondu sur les bords gauche et droit (en %)
  },
  // Physique du défilement & magnétisme
  physics: {
    lerpSpeed: 0.12, // Vitesse d'interpolation / fluidité du scroll
    wheelSensitivity: 0.8, // Sensibilité de la molette
    touchMomentum: 250, // Facteur d'inertie lors du lancer tactile (px/ms * momentum)
    snapDelay: 220, // Délai avant déclenchement du magnétisme (ms)
    snapMinDuration: 0.4, // Durée minimale de l'aimantation (s)
    snapMaxDuration: 0.75, // Durée maximale de l'aimantation (s)
    forwardThreshold: 0.08, // Seuil d'avancement pour valider la carte suivante (8%)
    backwardThreshold: 0.92, // Seuil de recul pour valider la carte précédente (92%)
  },
};

export interface OtherProjectsCarouselProps {
  projects: Project[];
  arcConfig?: Partial<typeof CAROUSEL_CONFIG.arc>;
}

export default function OtherProjectsCarousel({
  projects,
  arcConfig,
}: OtherProjectsCarouselProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapTweenRef = useRef<gsap.core.Tween | null>(null);
  const lastDeltaRef = useRef(0);
  const updateCurvatureRef = useRef<(() => void) | null>(null);

  const arcSettings = {
    ...CAROUSEL_CONFIG.arc,
    ...arcConfig,
  };

  // Gestion du glissement tactile (mobile / tablette)
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartScrollRef = useRef(0);
  const isTouchingRef = useRef(false);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const lastTouchXRef = useRef(0);
  const lastTouchTimeRef = useRef(0);
  const touchVelocityRef = useRef(0);

  // Répéter les projets pour avoir un cycle d'au moins 5 cartes et 4 répétitions de ce cycle
  const repeatFactor = Math.max(1, Math.ceil(5 / Math.max(1, projects.length)));
  const baseProjects =
    projects.length > 0
      ? Array.from(
          { length: projects.length * repeatFactor },
          (_, i) => projects[i % projects.length],
        )
      : [];
  const displayProjects = [
    ...baseProjects,
    ...baseProjects,
    ...baseProjects,
    ...baseProjects,
  ];
  const baseCount = baseProjects.length;

  useGSAP(
    () => {
      if (!trackRef.current || baseCount === 0) return;
      const track = trackRef.current;

      const card0 = track.children[0] as HTMLElement | undefined;
      const cardN = track.children[baseCount] as HTMLElement | undefined;
      const cardWidth = card0?.offsetWidth ?? 350;

      // Largeur exacte d'un cycle complet mesurée directement dans le DOM
      const cycleWidth =
        card0 && cardN
          ? cardN.offsetLeft - card0.offsetLeft
          : baseCount * (cardWidth + CAROUSEL_CONFIG.layout.cardGap);

      const centerOffset = (track.clientWidth - cardWidth) / 2;

      // Initialiser la position avec la première carte du Set 2 parfaitement centrée au milieu de l'écran
      const initialScroll = cycleWidth > 0 ? cycleWidth * 2 - centerOffset : 0;

      track.scrollLeft = initialScroll;
      currentScrollRef.current = initialScroll;
      targetScrollRef.current = initialScroll;

      const updateCurvature = () => {
        if (!trackRef.current) return;
        const trackEl = trackRef.current;
        const currentCardEl = trackEl.firstElementChild as HTMLElement | null;
        if (!currentCardEl) return;

        const currentCardWidth = currentCardEl.offsetWidth;
        if (currentCardWidth <= 0) return;
        const trackWidth = trackEl.clientWidth;
        const scrollCenter = trackEl.scrollLeft + trackWidth / 2;
        const radius = Math.max(
          arcSettings.minRadius,
          trackWidth * arcSettings.radiusMultiplier,
        );

        const children = trackEl.children;
        for (let i = 0; i < children.length; i++) {
          const card = children[i] as HTMLElement;
          const cardCenter = card.offsetLeft + currentCardWidth / 2;
          const dist = cardCenter - scrollCenter;

          if (Math.abs(dist) > trackWidth * arcSettings.cullDistanceFactor) {
            card.style.transform = "";
            continue;
          }

          const angle = gsap.utils.clamp(
            -arcSettings.maxAngle,
            arcSettings.maxAngle,
            dist / radius,
          );
          const y = radius * (1 - Math.cos(angle));
          const rot = angle * (180 / Math.PI) * arcSettings.rotationFactor;

          card.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
        }
      };

      updateCurvatureRef.current = updateCurvature;
      updateCurvature();

      const tickerFunc = () => {
        const diff = targetScrollRef.current - currentScrollRef.current;
        if (Math.abs(diff) > 0.05) {
          currentScrollRef.current += diff * CAROUSEL_CONFIG.physics.lerpSpeed;

          // On n'effectue le wrap infini que si aucun tween de snap n'est en cours pour éviter tout à-coup
          if (!snapTweenRef.current?.isActive() && cycleWidth > 0) {
            if (currentScrollRef.current >= cycleWidth * 2.5) {
              currentScrollRef.current -= cycleWidth;
              targetScrollRef.current -= cycleWidth;
            } else if (currentScrollRef.current < cycleWidth * 1.5) {
              currentScrollRef.current += cycleWidth;
              targetScrollRef.current += cycleWidth;
            }
          }

          track.scrollLeft = currentScrollRef.current;
          updateCurvature();
        }
      };

      gsap.ticker.add(tickerFunc);

      const handleResize = () => {
        updateCurvature();
        scheduleSnap();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        gsap.ticker.remove(tickerFunc);
        window.removeEventListener("resize", handleResize);
        if (snapTweenRef.current) {
          snapTweenRef.current.kill();
          snapTweenRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [projects, arcConfig, baseCount] },
  );

  const scheduleSnap = () => {
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      if (!trackRef.current || baseCount === 0) return;
      const track = trackRef.current;
      const card0 = track.children[0] as HTMLElement | undefined;
      const cardN = track.children[baseCount] as HTMLElement | undefined;
      if (!card0) return;

      const cardWidth = card0.offsetWidth;
      if (cardWidth <= 0) return;
      const cycleWidth =
        card0 && cardN
          ? cardN.offsetLeft - card0.offsetLeft
          : baseCount * (cardWidth + CAROUSEL_CONFIG.layout.cardGap);
      const step = cycleWidth / baseCount;
      const trackWidth = track.clientWidth;
      const centerOffset = (trackWidth - cardWidth) / 2;

      let currentTarget = targetScrollRef.current;

      // Recentrer la cible dans la zone de confort [1.5 * cycleWidth, 2.5 * cycleWidth]
      if (cycleWidth > 0) {
        while (currentTarget >= cycleWidth * 2.5) {
          currentTarget -= cycleWidth;
          targetScrollRef.current -= cycleWidth;
          currentScrollRef.current -= cycleWidth;
          track.scrollLeft = currentScrollRef.current;
        }
        while (currentTarget < cycleWidth * 1.5) {
          currentTarget += cycleWidth;
          targetScrollRef.current += cycleWidth;
          currentScrollRef.current += cycleWidth;
          track.scrollLeft = currentScrollRef.current;
        }
      }

      // Index flottant de la carte alignée avec le centre de l'écran
      const cardIndexFloat = (currentTarget + centerOffset) / step;
      const direction = lastDeltaRef.current;

      let nearestIndex: number;

      if (direction > 0) {
        // En scroll vers l'avant : une avancée intentionnelle valide le passage à la carte suivante
        const baseIndex = Math.floor(cardIndexFloat);
        const progress = cardIndexFloat - baseIndex;
        if (progress > CAROUSEL_CONFIG.physics.forwardThreshold) {
          nearestIndex = baseIndex + 1;
        } else {
          nearestIndex = baseIndex;
        }
      } else if (direction < 0) {
        // En scroll vers l'arrière : recul intentionnel vers la carte précédente
        const baseIndex = Math.floor(cardIndexFloat);
        const progress = cardIndexFloat - baseIndex;
        if (progress < CAROUSEL_CONFIG.physics.backwardThreshold) {
          nearestIndex = baseIndex;
        } else {
          nearestIndex = baseIndex + 1;
        }
      } else {
        nearestIndex = Math.round(cardIndexFloat);
      }

      // Position cible pour que la carte soit parfaitement centrée au milieu du viewport
      const nearest = nearestIndex * step - centerOffset;
      const dist = Math.abs(nearest - currentTarget);

      if (dist < 1) return;

      // Transition progressive et douce vers la carte ciblée au centre
      const duration = gsap.utils.clamp(
        CAROUSEL_CONFIG.physics.snapMinDuration,
        CAROUSEL_CONFIG.physics.snapMaxDuration,
        dist / 250,
      );

      snapTweenRef.current?.kill();
      snapTweenRef.current = gsap.to(targetScrollRef, {
        current: nearest,
        duration,
        ease: "power2.out",
        onComplete: () => {
          snapTweenRef.current = null;
        },
      });
    }, CAROUSEL_CONFIG.physics.snapDelay);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current || !trackRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isSectionVisible = rect.top < window.innerHeight && rect.bottom > 0;

      // Intercept wheel as soon as the section enters the viewport.
      if (isSectionVisible) {
        if (Math.abs(e.deltaY) > 0) {
          e.preventDefault();
          lastDeltaRef.current = Math.sign(e.deltaY);
          if (snapTweenRef.current) {
            snapTweenRef.current.kill();
            snapTweenRef.current = null;
          }
          targetScrollRef.current +=
            e.deltaY * CAROUSEL_CONFIG.physics.wheelSensitivity;
          scheduleSnap();
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !trackRef.current) return;
      const touch = e.touches[0];
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
      touchStartScrollRef.current = targetScrollRef.current;
      lastTouchXRef.current = touch.clientX;
      lastTouchTimeRef.current = performance.now();
      touchVelocityRef.current = 0;
      isHorizontalSwipeRef.current = null;
      isTouchingRef.current = true;

      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      if (snapTweenRef.current) {
        snapTweenRef.current.kill();
        snapTweenRef.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchingRef.current || !trackRef.current || baseCount === 0)
        return;
      const touch = e.touches[0];
      const diffX = touch.clientX - touchStartXRef.current;
      const diffY = touch.clientY - touchStartYRef.current;

      // Détecte si le geste est horizontal ou vertical après quelques pixels
      if (isHorizontalSwipeRef.current === null) {
        if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
          isHorizontalSwipeRef.current = Math.abs(diffX) > Math.abs(diffY);
        }
      }

      // Si le geste est horizontal, on intercepte et fait défiler le carrousel
      if (isHorizontalSwipeRef.current) {
        if (e.cancelable) e.preventDefault();

        const now = performance.now();
        const dt = now - lastTouchTimeRef.current;
        if (dt > 0) {
          const dx = touch.clientX - lastTouchXRef.current;
          touchVelocityRef.current = dx / dt;
        }
        lastTouchXRef.current = touch.clientX;
        lastTouchTimeRef.current = now;

        targetScrollRef.current = touchStartScrollRef.current - diffX;

        // Bouclage infini en glissement continu mesuré au cycle
        const card0 = trackRef.current.children[0] as HTMLElement | undefined;
        const cardN = trackRef.current.children[baseCount] as
          | HTMLElement
          | undefined;
        const cardWidth = card0?.offsetWidth ?? 350;
        const cycleWidth =
          card0 && cardN
            ? cardN.offsetLeft - card0.offsetLeft
            : baseCount * (cardWidth + CAROUSEL_CONFIG.layout.cardGap);

        if (cycleWidth > 0) {
          if (targetScrollRef.current >= cycleWidth * 2.5) {
            targetScrollRef.current -= cycleWidth;
            touchStartScrollRef.current -= cycleWidth;
            currentScrollRef.current -= cycleWidth;
            trackRef.current.scrollLeft = currentScrollRef.current;
          } else if (targetScrollRef.current < cycleWidth * 1.5) {
            targetScrollRef.current += cycleWidth;
            touchStartScrollRef.current += cycleWidth;
            currentScrollRef.current += cycleWidth;
            trackRef.current.scrollLeft = currentScrollRef.current;
          }
        }

        currentScrollRef.current = targetScrollRef.current;
        trackRef.current.scrollLeft = currentScrollRef.current;
        updateCurvatureRef.current?.();
      }
    };

    const handleTouchEnd = () => {
      if (!isTouchingRef.current || !trackRef.current) return;
      isTouchingRef.current = false;

      if (isHorizontalSwipeRef.current) {
        const v = touchVelocityRef.current; // px/ms
        // Inertie de lancer
        const momentum = -v * CAROUSEL_CONFIG.physics.touchMomentum;
        targetScrollRef.current += momentum;

        if (
          v < -0.15 ||
          targetScrollRef.current > touchStartScrollRef.current
        ) {
          lastDeltaRef.current = 1;
        } else if (
          v > 0.15 ||
          targetScrollRef.current < touchStartScrollRef.current
        ) {
          lastDeltaRef.current = -1;
        }

        scheduleSnap();
      }
      isHorizontalSwipeRef.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    const track = trackRef.current;
    if (track) {
      track.addEventListener("touchstart", handleTouchStart, { passive: true });
      track.addEventListener("touchmove", handleTouchMove, { passive: false });
      track.addEventListener("touchend", handleTouchEnd);
      track.addEventListener("touchcancel", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (track) {
        track.removeEventListener("touchstart", handleTouchStart);
        track.removeEventListener("touchmove", handleTouchMove);
        track.removeEventListener("touchend", handleTouchEnd);
        track.removeEventListener("touchcancel", handleTouchEnd);
      }
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      if (snapTweenRef.current) {
        snapTweenRef.current.kill();
        snapTweenRef.current = null;
      }
    };
  }, [baseCount]);

  if (!projects || projects.length === 0) {
    return null;
  }

  if (projects.length === 1) {
    return (
      <section
        ref={sectionRef}
        className="py-12 md:py-16 flex flex-col items-center gap-6 overflow-hidden w-full px-6"
      >
        <div className="w-[min(360px,80vw)]">
          <ProjectCard project={projects[0]} />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-center">
          <ScrollTypewriter start="top 85%" end="top 60%">
            On continue ?
          </ScrollTypewriter>
        </h2>
      </section>
    );
  }

  const fadePercent = CAROUSEL_CONFIG.layout.edgeFadePercent;
  const maskGradient = `linear-gradient(to right, transparent 0%, black ${fadePercent}%, black ${100 - fadePercent}%, transparent 100%)`;

  return (
    <section
      ref={sectionRef}
      className="pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 overflow-hidden w-full"
    >
      <div className="relative w-full">
        <div
          ref={trackRef}
          style={{
            maskImage: maskGradient,
            WebkitMaskImage: maskGradient,
            gap: `${CAROUSEL_CONFIG.layout.cardGap}px`,
          }}
          className="w-full overflow-x-hidden scrollbar-hide flex items-start pt-4 pb-38 md:pb-44 touch-pan-y"
        >
          {displayProjects.map((project, i) => (
            <div
              key={`${project.id}-${i}`}
              className="shrink-0 w-[min(350px,80vw)] will-change-transform"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Titre niché directement au centre dans le creux de l'arc, sans ajouter d'espace sous le carrousel */}
        <div className="absolute bottom-3 sm:bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 pointer-events-none text-center px-4 z-10 w-full max-w-xl flex justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-center whitespace-nowrap">
            <ScrollTypewriter start="top 85%" end="top 60%">
              On continue ?
            </ScrollTypewriter>
          </h2>
        </div>
      </div>
    </section>
  );
}
