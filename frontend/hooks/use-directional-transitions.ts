"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook pour implémenter des view transitions directionnelles avec l'API native.
 * - Navigation vers racine : nouvelle page arrive de la gauche
 * - Navigation vers sous-page : nouvelle page arrive de la droite
 * - L'ancienne page reste fixe pendant la transition
 */
export function useDirectionalTransitions() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("http")) return;

      const hrefPathname = href.split("?")[0].split("#")[0];

      if (hrefPathname === pathname) return;

      // Empêcher la navigation normale
      e.preventDefault();
      e.stopPropagation();

      // Calculer la direction
      const currentSegments = pathname.split("/").filter(Boolean);
      const targetSegments = hrefPathname.split("/").filter(Boolean);

      let direction: string | null = null;

      if (targetSegments.length < currentSegments.length) {
        direction = "to-root";
      } else if (targetSegments.length > currentSegments.length) {
        direction = "to-subpage";
      }

      // Appliquer les animations directionnelles
      if (direction) {
        if (direction === "to-root") {
          // Navigation vers racine : nouvelle page slide depuis la gauche
          document.documentElement.style.setProperty(
            "--transition-new-animation",
            "slide-in-left"
          );
        } else if (direction === "to-subpage") {
          // Navigation vers sous-page : nouvelle page slide depuis la droite
          document.documentElement.style.setProperty(
            "--transition-new-animation",
            "slide-in-right"
          );
        }
      }

      // Utiliser View Transitions API native avec navigation synchronisée
      if (document.startViewTransition) {
        document
          .startViewTransition(async () => {
            // D'abord naviguer et attendre que le DOM soit mis à jour
            router.push(href);

            // Attendre que Next.js ait terminé la navigation
            await new Promise((resolve) => {
              const checkNavigation = () => {
                if (window.location.pathname === hrefPathname) {
                  // Petit délai supplémentaire pour s'assurer que le contenu est rendu
                  setTimeout(resolve, 50);
                } else {
                  setTimeout(checkNavigation, 10);
                }
              };
              checkNavigation();
            });
          })
          .finished.then(() => {
            // Nettoyer la variable CSS
            document.documentElement.style.removeProperty(
              "--transition-new-animation"
            );
          })
          .catch(() => {
            // Nettoyer la variable CSS
            document.documentElement.style.removeProperty(
              "--transition-new-animation"
            );
          });
      } else {
        // Fallback
        router.push(href);
        setTimeout(() => {
          document.documentElement.style.removeProperty(
            "--transition-new-animation"
          );
        }, 100);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, [pathname, router]);
}
