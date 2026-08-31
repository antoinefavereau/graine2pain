"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({
  children,
}: Readonly<LenisProviderProps>) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Désactiver la restauration automatique du scroll du navigateur
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.2,
    });

    lenisRef.current = lenis;

    // === 1. Synchroniser Lenis avec GSAP ticker ===
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // === 2. Configurer scrollerProxy pour GSAP ScrollTrigger ===
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },

      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // Permet de gérer le pinning
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    // À chaque scroll de Lenis, on informe ScrollTrigger
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", updateScrollTrigger);

    // Cleanup
    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll en haut lors des changements de page
  useEffect(() => {
    const resetScroll = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      ScrollTrigger.refresh();
    };

    resetScroll();

    // Re-trigger après un court délai pour s'assurer que le rendu/DOM est stable
    const timer = setTimeout(() => {
      resetScroll();
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return <>{children}</>;
}
