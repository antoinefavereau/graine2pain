"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

export interface BacklightTitleProps {
  /** Prénom (par défaut issu des traductions : t("firstName")) */
  firstName?: string;
  /** Nom (par défaut issu des traductions : t("lastName")) */
  lastName?: string;

  // --- Paramètres de la lumière & dimensions ---
  /**
   * Couleur du faisceau lumineux (ex: "var(--secondary-base)", "--primary-base", "#9b6bff").
   * @default "var(--secondary-base)"
   */
  color?: string;
  /**
   * Couleur de fond de base du texte en dehors du faisceau lumineux.
   * @default "var(--grey-black)"
   */
  baseColor?: string;
  /**
   * Intensité / luminosité du faisceau lumineux.
   * @default 1
   */
  intensity?: number;
  /**
   * Vitesse / durée de l'inertie en secondes (ex: 0.15 = très réactif, 0.45 = fluide, 0.9 = lent/lourd).
   * @default 0.45
   */
  speed?: number;
  /**
   * Rayon / taille du faisceau en pourcentage de la taille de l'écran (ex: 35 pour 35vw, ou "35vw", "40vmin").
   * @default 35
   */
  radius?: number | string;
  /**
   * Taille du texte en pourcentage de la taille de l'écran (ex: 8.5 pour 8.5vw, ou "8.5vw", "clamp(...)").
   * @default 8.5
   */
  fontSize?: number | string;
  /**
   * Position de repos par défaut quand le curseur quitte la zone (ratio x et y de 0 à 1).
   * @default { x: 1, y: 0 }
   */
  defaultPosition?: { x: number; y: number };
  /**
   * Tracker la souris sur l'ensemble de la page (true) ou seulement au survol du titre (false).
   * @default true
   */
  trackOnWindow?: boolean;

  /** Classes CSS additionnelles pour le conteneur */
  className?: string;
}

export default function BacklightTitle({
  firstName,
  lastName,
  color = "var(--secondary-base)",
  baseColor = "var(--grey-black)",
  intensity = 1,
  speed = 0.45,
  radius = 60,
  fontSize = 14,
  defaultPosition = { x: 0.6, y: -0.3 },
  trackOnWindow = true,
  className,
}: BacklightTitleProps) {
  const t = useTranslations("About");
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLHeadingElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);

  const displayFirstName = firstName ?? t("firstName");
  const displayLastName = lastName ?? t("lastName");

  // Résolution des couleurs (accepte "--color" ou "var(--color)" ou hex)
  const resolvedColor = color.startsWith("--") ? `var(${color})` : color;
  const resolvedBaseColor = baseColor.startsWith("--")
    ? `var(${baseColor})`
    : baseColor;

  // Résolution du rayon et de la taille du texte en pourcentage de la taille de l'écran
  const resolvedRadius =
    typeof radius === "string" ? radius : `${radius * intensity}vw`;

  const resolvedFontSize =
    typeof fontSize === "string" ? fontSize : `${fontSize}vw`;

  // Dégradé radial avec rayon proportionnel à la taille de l'écran
  const gradientStyle = `radial-gradient(${resolvedRadius} circle at var(--light-x) var(--light-y), ${resolvedColor} 0%, transparent 100%)`;

  useEffect(() => {
    const container = containerRef.current;
    const textWrapper = textWrapperRef.current;
    if (!container || !textWrapper) return;

    const calculateDefaultPosition = () => {
      const textRect = textWrapper.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offsetX = textRect.left - containerRect.left;
      const offsetY = textRect.top - containerRect.top;
      const defaultX = offsetX + textRect.width * (defaultPosition.x ?? 1);
      const defaultY = offsetY + textRect.height * (defaultPosition.y ?? 0);
      return { defaultX, defaultY };
    };

    const { defaultX, defaultY } = calculateDefaultPosition();
    posRef.current = { x: defaultX, y: defaultY };
    container.style.setProperty("--light-x", `${defaultX}px`);
    container.style.setProperty("--light-y", `${defaultY}px`);

    const xTo = gsap.quickTo(posRef.current, "x", {
      duration: speed,
      ease: "power2.out",
    });

    const yTo = gsap.quickTo(posRef.current, "y", {
      duration: speed,
      ease: "power2.out",
    });

    let lastX = defaultX;
    let lastY = defaultY;
    let lastScrollY = window.scrollY;
    const lastPointerPos = { clientX: 0, clientY: 0, hasPos: false };

    const updatePointerTarget = (clientX: number, clientY: number) => {
      lastPointerPos.clientX = clientX;
      lastPointerPos.clientY = clientY;
      lastPointerPos.hasPos = true;
      isHoveredRef.current = true;

      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      xTo(x);
      yTo(y);
    };

    // Mise à jour groupée au taux de rafraîchissement de l'écran (évite les doubles mutations CSS)
    const onTick = () => {
      // Si la page a défilé (Lenis ou scroll natif), on recalcule la position de la lumière
      const currentScrollY = window.scrollY;
      if (currentScrollY !== lastScrollY) {
        lastScrollY = currentScrollY;
        if (isHoveredRef.current && lastPointerPos.hasPos) {
          const rect = container.getBoundingClientRect();
          const x = lastPointerPos.clientX - rect.left;
          const y = lastPointerPos.clientY - rect.top;
          xTo(x);
          yTo(y);
        }
      }

      const curX = posRef.current.x;
      const curY = posRef.current.y;
      if (curX !== lastX || curY !== lastY) {
        lastX = curX;
        lastY = curY;
        container.style.setProperty("--light-x", `${curX}px`);
        container.style.setProperty("--light-y", `${curY}px`);
      }
    };

    gsap.ticker.add(onTick);

    const handleMouseMove = (e: MouseEvent) => {
      updatePointerTarget(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointerTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      updatePointerTarget(e.clientX, e.clientY);
    };

    const handleScroll = () => {
      if (isHoveredRef.current && lastPointerPos.hasPos) {
        const rect = container.getBoundingClientRect();
        const x = lastPointerPos.clientX - rect.left;
        const y = lastPointerPos.clientY - rect.top;
        xTo(x);
        yTo(y);
      }
    };

    const handlePointerLeave = () => {
      isHoveredRef.current = false;
      lastPointerPos.hasPos = false;
      const { defaultX: resetX, defaultY: resetY } = calculateDefaultPosition();
      xTo(resetX);
      yTo(resetY);
    };

    const handleResize = () => {
      if (!isHoveredRef.current) {
        const { defaultX: resetX, defaultY: resetY } =
          calculateDefaultPosition();
        xTo(resetX);
        yTo(resetY);
      }
    };

    const target = trackOnWindow ? window : container;

    target.addEventListener("mousemove", handleMouseMove as EventListener);
    target.addEventListener("touchmove", handleTouchMove as EventListener, {
      passive: true,
    });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (trackOnWindow) {
      document.addEventListener("mouseleave", handlePointerLeave);
      window.addEventListener("touchend", handlePointerLeave);
    } else {
      container.addEventListener("mouseleave", handlePointerLeave);
      container.addEventListener("touchend", handlePointerLeave);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(onTick);
      target.removeEventListener("mousemove", handleMouseMove as EventListener);
      target.removeEventListener("touchmove", handleTouchMove as EventListener);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);

      if (trackOnWindow) {
        document.removeEventListener("mouseleave", handlePointerLeave);
        window.removeEventListener("touchend", handlePointerLeave);
      } else {
        container.removeEventListener("mouseleave", handlePointerLeave);
        container.removeEventListener("touchend", handlePointerLeave);
      }

      window.removeEventListener("resize", handleResize);
    };
  }, [defaultPosition.x, defaultPosition.y, speed, trackOnWindow]);

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "relative select-none w-full flex flex-col items-start cursor-default",
        className,
      )}
      style={
        {
          "--light-x": `${(defaultPosition.x ?? 1) * 100}%`,
          "--light-y": `${(defaultPosition.y ?? 0) * 100}%`,
        } as React.CSSProperties
      }
    >
      <h1
        ref={textWrapperRef}
        className="relative tracking-tight leading-[0.75] font-bold"
        style={{
          fontSize: resolvedFontSize,
          backgroundColor: resolvedBaseColor,
          backgroundImage: gradientStyle,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <span>{displayFirstName + "\n"}</span>
        <span className="uppercase">{displayLastName}</span>
      </h1>
    </div>
  );
}
