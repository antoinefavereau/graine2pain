"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MenuItem from "./menu-item";

const navItems = [
  { href: "/", icon: "home", label: "Accueil" },
  { href: "/#", icon: "school", label: "Diplômes" },
  { href: "/#", icon: "business_center", label: "Experiences" },
  { href: "/projets", icon: "draw", label: "Projets" },
];

export default function Header() {
  const [previousPath, setPreviousPath] = useState("/");
  const currentPath = usePathname();

  useEffect(() => {
    // Récupérer la page précédente depuis l'historique ou définir une valeur par défaut
    const referrer = document.referrer;
    if (referrer && referrer !== window.location.href) {
      try {
        const url = new URL(referrer);
        // Si le referrer est du même domaine, utiliser le pathname
        if (url.origin === window.location.origin) {
          setPreviousPath(url.pathname);
        } else {
          setPreviousPath("/");
        }
      } catch {
        setPreviousPath("/");
      }
    } else {
      // Si pas de referrer, utiliser la page d'accueil par défaut
      setPreviousPath("/");
    }
  }, [currentPath]);
  return (
    <header className="sticky top-0 z-10 bg-dark">
      <div className="w-full h-4 bg-linear-to-r/srgb from-primary to-secondary"></div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-20 py-2">
        <div className="flex items-center">
          <MenuItem
            item={{ href: previousPath, icon: "undo", label: "Retour" }}
          />
          <nav className="grow">
            <ul className="flex justify-center items-center">
              {navItems.map((item) => (
                <li key={item.label}>
                  <MenuItem item={item} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div
          className="group flex flex-col -space-y-2 font-heading font-black text-center"
          aria-label="Moreau Athéna"
        >
          <span className="text-[20px]">
            M<span className="sr-only">O</span>
            <div
              className="relative inline-block h-[1cap] w-[1ch] group-hover:w-[2ch] bg-linear-to-r from-secondary to-transparent rounded-[0.8cap] transition-width duration-300 ease-in-out"
              aria-hidden="true"
            >
              <div className="absolute inset-[0.24cap_0.28cap] bg-dark rounded-[0.8cap]"></div>
            </div>
            REAU
          </span>
          <span
            className="text-[21px]"
            style={{
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "0.2px var(--color-white)",
            }}
          >
            ATHÉNA
          </span>
        </div>
        <div className="flex justify-end">
          <a
            className="underline text-sm"
            href="mailto:cheveche.d.athena05@gmail.com"
          >
            cheveche.d.athena05@gmail.com
          </a>
        </div>
      </div>
    </header>
  );
}
