"use client";

import { Fragment, useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import LocaleSwitcher from "@/components/LocaleSwitcher";

type NavbarLink = {
  href: string;
  label: string;
  color: "primary" | "secondary" | "grey" | "info" | "warning" | "error";
};

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLLIElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const links: NavbarLink[] = [
    { href: "/", label: t("home"), color: "primary" },
    {
      href: "/about",
      label: t("about"),
      color: "secondary",
    },
    {
      href: "/projects",
      label: t("projects"),
      color: "warning",
    },
    {
      href: "/contact",
      label: t("contact"),
      color: "info",
    },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useGSAP(
    () => {
      const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (nameRef.current)
        timeline.set(nameRef.current, { autoAlpha: 0, y: 12 });
      if (items.length > 0) timeline.set(items, { autoAlpha: 0, y: 12 });

      if (nameRef.current) {
        timeline.to(nameRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
        });
      }

      if (items.length > 0) {
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
      }
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
    <nav className="relative" ref={navRef}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center items-center relative px-8 pt-10 pb-2">
        <ul className="flex justify-around items-center w-full max-w-5xl">
          {links.map((link, index) => {
            return (
              <Fragment key={link.href}>
                <li
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                >
                  <Link
                    href={link.href}
                    className={twMerge(
                      "px-4 py-3 uppercase text-grey-lighter text-xs transition-colors",
                      `hover:${getColor(link.color)}`,
                      (link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href)) &&
                        getColor(link.color),
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
        <div className="absolute right-6 top-10">
          <LocaleSwitcher />
        </div>
      </div>

      {/* Mobile Navigation Header */}
      <div className="flex md:hidden justify-between items-center px-6 pt-6 pb-2">
        <Link
          href="/"
          className="text-xl bg-linear-to-r from-secondary-base to-primary-base bg-clip-text text-transparent"
        >
          MOREAU ATHÉNA
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Button
            variant="outline"
            color="grey"
            onlyIcon
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={isOpen}
          >
            <Icon name={isOpen ? "close" : "menu"} className="text-2xl!" />
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 z-50 mt-2 p-5 rounded-2xl bg-grey-darkest/95 backdrop-blur-xl border border-grey-dark/40 shadow-2xl flex flex-col gap-3">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={twMerge(
                  "uppercase text-xs tracking-wider py-3 px-4 rounded-xl transition-all flex items-center justify-between",
                  isActive
                    ? `${getColor(link.color)} bg-grey-darker/80 font-semibold border border-grey-dark/30`
                    : "text-grey-lighter hover:bg-grey-darker/40",
                )}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
