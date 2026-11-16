"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { setLocaleAction } from "@/lib/actions/locale";
import { twMerge } from "tailwind-merge";

interface LocaleSwitcherProps {
  className?: string;
}

export default function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (locale: "fr" | "en") => {
    if (locale === currentLocale || isPending) return;
    startTransition(async () => {
      await setLocaleAction(locale);
    });
  };

  return (
    <div
      className={twMerge(
        "inline-flex items-center text-xs tracking-wider rounded-full border border-grey-dark/50 bg-grey-darkest/70 p-1 backdrop-blur-sm",
        isPending && "opacity-60 cursor-wait",
        className,
      )}
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => handleToggle("fr")}
        disabled={isPending}
        className={twMerge(
          "px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer text-xs font-medium",
          currentLocale === "fr"
            ? "bg-grey-darker text-primary-base font-semibold shadow-xs"
            : "text-grey-lighter hover:text-white",
        )}
      >
        FR
      </button>
      <span className="text-grey-dark select-none text-[10px]">|</span>
      <button
        type="button"
        onClick={() => handleToggle("en")}
        disabled={isPending}
        className={twMerge(
          "px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer text-xs font-medium",
          currentLocale === "en"
            ? "bg-grey-darker text-primary-base font-semibold shadow-xs"
            : "text-grey-lighter hover:text-white",
        )}
      >
        EN
      </button>
    </div>
  );
}
