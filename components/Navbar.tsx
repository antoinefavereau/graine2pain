"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

import Card from "@/components/Card";
import Icon from "@/components/Icon";
import LocaleSwitcher from "@/components/LocaleSwitcher";

type ColorType = "primary" | "secondary" | "warning" | "info";

type NavbarLink = {
  href: string;
  label: string;
  icon: string;
  color: ColorType;
};

const colorStyles: Record<
  ColorType,
  {
    active: string;
    hover: string;
    text: string;
  }
> = {
  primary: {
    active: "bg-primary-base text-grey-darkest",
    hover: "hover:text-primary-base hover:bg-primary-base/10",
    text: "text-primary-base",
  },
  secondary: {
    active: "bg-secondary-base text-grey-darkest",
    hover: "hover:text-secondary-base hover:bg-secondary-base/10",
    text: "text-secondary-base",
  },
  warning: {
    active: "bg-warning-base text-grey-darkest",
    hover: "hover:text-warning-base hover:bg-warning-base/10",
    text: "text-warning-base",
  },
  info: {
    active: "bg-info-base text-grey-darkest",
    hover: "hover:text-info-base hover:bg-info-base/10",
    text: "text-info-base",
  },
};

// Persistent flags across client-side page navigations
let hasAnimatedInitialEntrance = false;
let wasScrolledGlobal = false;
let previousIndicatorState: {
  pathname: string;
  left: number;
  width: number;
  color: ColorType;
} | null = null;
let cachedExpandedPositions: { left: number; width: number }[] = [];
let cachedTextWidths: number[] = [];

const fallbackWidths = [104, 144, 104, 144];
const fallbackTextWidths = [56, 96, 56, 96];

const getExpandedFallback = (index: number) => {
  let left = 0;
  for (let i = 0; i < index; i++) {
    left += (cachedExpandedPositions[i]?.width ?? fallbackWidths[i]) + 6;
  }
  const width =
    cachedExpandedPositions[index]?.width ?? fallbackWidths[index] ?? 104;
  return { left, width };
};

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [isScrolled, setIsScrolled] = useState(wasScrolledGlobal);
  const [, setMeasureTick] = useState(0);

  const isNewRoute =
    previousIndicatorState !== null &&
    previousIndicatorState.pathname !== pathname;
  const [animatingRoute, setAnimatingRoute] = useState(isNewRoute);

  useEffect(() => {
    if (animatingRoute) {
      const timer = setTimeout(() => {
        setAnimatingRoute(false);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [animatingRoute]);

  const links: NavbarLink[] = [
    {
      href: "/",
      label: t("home"),
      icon: "home",
      color: "primary",
    },
    {
      href: "/about",
      label: t("about"),
      icon: "person",
      color: "secondary",
    },
    {
      href: "/projects",
      label: t("projects"),
      icon: "folder_open",
      color: "warning",
    },
    {
      href: "/contact",
      label: t("contact"),
      icon: "chat_bubble",
      color: "info",
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const activeIndex = links.findIndex((link) => isLinkActive(link.href));
  const currentLink = activeIndex !== -1 ? links[activeIndex] : null;
  const currentLinkColor: ColorType = currentLink
    ? currentLink.color
    : "primary";

  // Mesure et mémorisation des dimensions de tous les liens à l'état étendu
  const measureExpandedLinks = () => {
    if (isScrolled) return;
    let changed = false;
    links.forEach((_, i) => {
      const el = itemRefs.current[i];
      if (el && el.offsetWidth > 48) {
        if (
          !cachedExpandedPositions[i] ||
          cachedExpandedPositions[i].left !== el.offsetLeft ||
          cachedExpandedPositions[i].width !== el.offsetWidth
        ) {
          cachedExpandedPositions[i] = {
            left: el.offsetLeft,
            width: el.offsetWidth,
          };
          changed = true;
        }
        const span = el.querySelector("span");
        if (span && span.scrollWidth > 20) {
          if (cachedTextWidths[i] !== span.scrollWidth) {
            cachedTextWidths[i] = span.scrollWidth;
            changed = true;
          }
        }
      }
    });
    if (changed) {
      setMeasureTick((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!isScrolled) {
      measureExpandedLinks();
      const timer = setTimeout(measureExpandedLinks, 420);
      return () => clearTimeout(timer);
    }
  }, [isScrolled, pathname, t]);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (!isScrolled) {
          measureExpandedLinks();
        }
      });
    }
  }, [isScrolled]);

  useEffect(() => {
    const handleResize = () => {
      if (!isScrolled) {
        measureExpandedLinks();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isScrolled]);

  // Position et largeur cibles pour l'état actuel
  let targetLeft = 0;
  let targetWidth = 40;

  if (activeIndex !== -1) {
    if (isScrolled) {
      targetWidth = 40;
      targetLeft = activeIndex * 46; // 40px cercle + 6px (gap-1.5)
    } else {
      const cached = cachedExpandedPositions[activeIndex];
      if (cached && cached.width > 48) {
        targetLeft = cached.left;
        targetWidth = cached.width;
      } else {
        const fallback = getExpandedFallback(activeIndex);
        targetLeft = fallback.left;
        targetWidth = fallback.width;
      }
    }
  }

  // Si on arrive depuis une autre page, on démarre à la position et couleur de la page précédente
  // pour que la transition CSS glisse fluidement vers le nouveau lien
  const indicatorLeft =
    animatingRoute && previousIndicatorState
      ? previousIndicatorState.left
      : targetLeft;

  const indicatorWidth =
    animatingRoute && previousIndicatorState
      ? previousIndicatorState.width
      : targetWidth;

  const displayColor: ColorType =
    animatingRoute && previousIndicatorState
      ? previousIndicatorState.color
      : currentLinkColor;

  // Maintien à jour de previousIndicatorState une fois stabilisé
  useEffect(() => {
    if (!animatingRoute && activeIndex !== -1) {
      previousIndicatorState = {
        pathname,
        left: targetLeft,
        width: targetWidth,
        color: currentLinkColor,
      };
    }
  }, [
    animatingRoute,
    pathname,
    targetLeft,
    targetWidth,
    currentLinkColor,
    activeIndex,
  ]);

  // Scroll detection with hysteresis to avoid any flickering / bouncing
  useEffect(() => {
    let lastScrolled = wasScrolledGlobal;

    const handleScroll = () => {
      const y = window.scrollY;
      if (!lastScrolled && y > 50) {
        lastScrolled = true;
        wasScrolledGlobal = true;
        setIsScrolled(true);
      } else if (lastScrolled && y < 20) {
        lastScrolled = false;
        wasScrolledGlobal = false;
        setIsScrolled(false);
      }
    };

    if (wasScrolledGlobal) {
      // Si on arrive depuis une page déjà scrollée, on laisse le composant s'afficher
      // en état réduit au montage puis on anime l'agrandissement vers l'état étendu
      const timer = setTimeout(() => {
        handleScroll();
      }, 60);

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        clearTimeout(timer);
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Entrance animation with smooth in-out ease — uniquement au premier chargement
  useGSAP(
    () => {
      if (!navRef.current) return;
      if (hasAnimatedInitialEntrance) return;
      hasAnimatedInitialEntrance = true;

      gsap.fromTo(
        navRef.current,
        { autoAlpha: 0, y: -20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.inOut",
          clearProps: "transform",
        },
      );
    },
    { scope: navRef },
  );

  return (
    <header className="relative w-full h-20 md:h-24 pointer-events-none">
      <Card
        ref={navRef}
        wrapperClassName="pointer-events-auto"
        className="fixed top-6 right-8 z-50 flex items-center py-2 px-3 rounded-full before:rounded-full gap-1.5"
      >
        <nav
          aria-label={t("mainNavigation")}
          className="flex items-center gap-2"
        >
          <ul className="relative flex items-center gap-1.5">
            {/* Sliding active indicator (comme LocaleSwitcher avec fondu croisé de couleur comme ProjectBackgroundGlow) */}
            {activeIndex !== -1 && (
              <div
                aria-hidden="true"
                className={twMerge(
                  "absolute top-0 bottom-0 rounded-full pointer-events-none overflow-hidden z-0 shadow-xs",
                  "transition-[transform,width] duration-400 ease-in-out will-change-transform",
                  indicatorWidth > 0 ? "opacity-100" : "opacity-0",
                )}
                style={{
                  transform: `translateX(${indicatorLeft}px)`,
                  width: `${indicatorWidth}px`,
                }}
              >
                {/* Couches de couleur à fondu croisé accéléré matériellement */}
                <div
                  className={twMerge(
                    "absolute inset-0 rounded-full bg-primary-base transition-opacity duration-400 ease-in-out will-change-opacity",
                    displayColor === "primary" ? "opacity-100" : "opacity-0",
                  )}
                />
                <div
                  className={twMerge(
                    "absolute inset-0 rounded-full bg-secondary-base transition-opacity duration-400 ease-in-out will-change-opacity",
                    displayColor === "secondary" ? "opacity-100" : "opacity-0",
                  )}
                />
                <div
                  className={twMerge(
                    "absolute inset-0 rounded-full bg-warning-base transition-opacity duration-400 ease-in-out will-change-opacity",
                    displayColor === "warning" ? "opacity-100" : "opacity-0",
                  )}
                />
                <div
                  className={twMerge(
                    "absolute inset-0 rounded-full bg-info-base transition-opacity duration-400 ease-in-out will-change-opacity",
                    displayColor === "info" ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>
            )}

            {links.map((link, index) => {
              const active = isLinkActive(link.href);
              const colorConfig = colorStyles[link.color];
              const textWidth =
                cachedTextWidths[index] ?? fallbackTextWidths[index] ?? 90;

              return (
                <li
                  key={link.href}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative z-10"
                >
                  <Link
                    href={link.href}
                    title={link.label}
                    aria-label={link.label}
                    className={twMerge(
                      "h-10 min-w-10 rounded-full flex items-center justify-center cursor-pointer select-none",
                      "transition-[padding,background-color,color] duration-400 ease-in-out",
                      active
                        ? "text-grey-darkest font-semibold hover:text-grey-darkest hover:bg-transparent"
                        : `text-grey-light ${colorConfig.hover}`,
                      isScrolled ? "px-2" : "px-3",
                    )}
                  >
                    <Icon
                      name={link.icon}
                      className={twMerge(
                        "text-[20px]! shrink-0 transition-colors duration-400 ease-in-out",
                        active ? "text-grey-darkest" : "text-current",
                      )}
                    />
                    <span
                      style={{
                        maxWidth: isScrolled ? "0px" : `${textWidth}px`,
                      }}
                      className={twMerge(
                        "overflow-hidden whitespace-nowrap text-xs font-semibold uppercase select-none hidden md:inline-block",
                        "transition-[max-width,opacity,margin] duration-400 ease-in-out",
                        isScrolled ? "opacity-0 ml-0" : "opacity-100 ml-2",
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <LocaleSwitcher />
        </nav>
      </Card>
    </header>
  );
}
