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

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const navRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Scroll detection with hysteresis to avoid any flickering / bouncing
  useEffect(() => {
    let lastScrolled = false;

    const handleScroll = () => {
      const y = window.scrollY;
      if (!lastScrolled && y > 50) {
        lastScrolled = true;
        setIsScrolled(true);
      } else if (lastScrolled && y < 20) {
        lastScrolled = false;
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation with smooth in-out ease
  useGSAP(
    () => {
      if (!navRef.current) return;
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

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

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
          <ul className="flex items-center gap-1.5">
            {links.map((link) => {
              const active = isLinkActive(link.href);
              const colorConfig = colorStyles[link.color];

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    title={link.label}
                    aria-label={link.label}
                    className={twMerge(
                      "h-10 min-w-10 rounded-full flex items-center justify-center cursor-pointer select-none",
                      "transition-[padding,background-color,color] duration-400 ease-in-out",
                      active
                        ? `${colorConfig.active} font-semibold`
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
                      className={twMerge(
                        "overflow-hidden whitespace-nowrap text-xs font-semibold uppercase select-none",
                        "transition-[max-width,opacity,margin] duration-400 ease-in-out",
                        isScrolled
                          ? "max-w-0 opacity-0 ml-0"
                          : "max-w-40 opacity-100 ml-2",
                        !isScrolled && "hidden md:inline-block",
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
