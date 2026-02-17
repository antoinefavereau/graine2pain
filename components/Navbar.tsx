"use client";

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

  return (
    <div className="fixed left-0 right-0 top-0 flex justify-center p-10 z-10">
      <Card className="p-2">
        <nav>
          <ul className="flex gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Button
                  variant="text"
                  color={link.color}
                  href={link.href}
                  active={pathname === link.href}
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
