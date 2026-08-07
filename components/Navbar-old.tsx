"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import Button from "./Button";
import Card from "./Card";
import Icon from "./Icon";

type NavbarLink = {
  href: string;
  label: string;
  color: "primary" | "secondary" | "grey" | "info" | "warning" | "error";
  icon: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const links: NavbarLink[] = [
    { href: "/", label: "Accueil", color: "primary", icon: "home" },
    {
      href: "/about",
      label: "Présentation",
      color: "secondary",
      icon: "person",
    },
    {
      href: "/projects",
      label: "Projets",
      color: "warning",
      icon: "folder_open",
    },
    {
      href: "/contact",
      label: "Me contacter",
      color: "info",
      icon: "chat_bubble",
    },
  ];

  useGSAP(
    () => {
      const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      timeline.set(navRef.current, { autoAlpha: 0, y: 16 });
      timeline.set(items, { autoAlpha: 0, y: 12 });

      timeline.to(navRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
      });

      timeline.to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          clearProps: "opacity,visibility,transform",
        },
        "-=0.25",
      );
    },
    { scope: navRef },
  );

  return (
    <div className="fixed left-0 right-0 top-0 flex justify-center p-10 z-10">
      <Card ref={navRef} className="p-2">
        <nav>
          <ul className="flex gap-5">
            {links.map((link, index) => (
              <li
                key={link.href}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
              >
                <Button
                  variant="text"
                  color={link.color}
                  href={link.href}
                  active={
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href)
                  }
                  className="text-sm font-semibold"
                >
                  <Icon name={link.icon} className="text-[20px]!" />
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </Card>
    </div>
  );
}
