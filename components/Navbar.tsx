"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

import Link from "next/link";
import { twMerge } from "tailwind-merge";

type NavbarLink = {
  href: string;
  label: string;
  color: "primary" | "secondary" | "grey" | "info" | "warning" | "error";
};

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLLIElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const links: NavbarLink[] = [
    { href: "/", label: "Accueil", color: "primary" },
    {
      href: "/about",
      label: "Présentation",
      color: "secondary",
    },
    {
      href: "/projects",
      label: "Projets",
      color: "warning",
    },
    {
      href: "/contact",
      label: "Me contacter",
      color: "info",
    },
  ];

  useGSAP(
    () => {
      const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      timeline.set(nameRef.current, { autoAlpha: 0, y: 12 });
      timeline.set(items, { autoAlpha: 0, y: 12 });

      timeline.to(nameRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
      });

      timeline.to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          clearProps: "opacity,visibility,transform",
        },
        "-=0.25",
      );
    },
    { scope: navRef },
  );

  const getColor = (color: NavbarLink["color"]) => {
    switch (color) {
      case "primary":
        return "text-primary-base";
      case "secondary":
        return "text-secondary-base";
      case "warning":
        return "text-warning-base";
      case "info":
        return "text-info-base";
      default:
        return "text-grey-base";
    }
  };

  return (
    <nav className="relative">
      <ul className="flex justify-around items-center gap-5 px-4 pt-10 pb-2">
        {links.map((link, index) => {
          return (
            <Fragment key={link.href}>
              <li
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
              >
                <Link
                  color={link.color}
                  href={link.href}
                  className={twMerge(
                    "uppercase text-grey-lighter text-xs",
                    `hover:${getColor(link.color)}`,
                    (link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href)) && getColor(link.color),
                  )}
                >
                  {link.label}
                </Link>
              </li>
              {index + 1 === links.length / 2 && (
                <li ref={nameRef}>
                  <Link
                    href="/"
                    className="text-2xl bg-linear-to-r from-secondary-base to-primary-base bg-clip-text text-transparent"
                  >
                    MOREAU ATHÉNA
                  </Link>
                </li>
              )}
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
}
