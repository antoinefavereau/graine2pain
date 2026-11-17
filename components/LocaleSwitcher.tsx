"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition, useState, useEffect } from "react";
import { setLocaleAction } from "@/lib/actions/locale";
import { twMerge } from "tailwind-merge";

import Card from "@/components/Card";
import Button from "@/components/Button";

interface LocaleSwitcherProps {
  className?: string;
}

export default function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations("LocaleSwitcher");
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [optimisticLocale, setOptimisticLocale] = useState(currentLocale);

  useEffect(() => {
    setOptimisticLocale(currentLocale);
  }, [currentLocale]);

  const handleToggle = (locale: "fr" | "en") => {
    if (locale === optimisticLocale || isPending) return;
    setOptimisticLocale(locale);
    startTransition(async () => {
      await setLocaleAction(locale);
    });
  };

  return (
    <Card
      wrapperClassName={twMerge("inline-flex shrink-0", className)}
      className={twMerge(
        "relative flex items-center h-10 rounded-full before:rounded-full select-none",
      )}
      aria-label={t("languageSelector")}
    >
      {/* Sliding circular indicator */}
      <div
        className={twMerge(
          "absolute top-0 bottom-0 w-10 h-10 rounded-full bg-[#d9dbdf] shadow-xs transition-transform duration-300 ease-in-out pointer-events-none",
          optimisticLocale === "en" ? "translate-x-10" : "translate-x-0",
        )}
      />

      <Button
        type="button"
        variant="text"
        color="grey"
        onClick={() => handleToggle("fr")}
        disabled={isPending}
        className={twMerge(
          "relative z-10 w-10 h-10 p-0 rounded-full text-xs font-semibold cursor-pointer border-none hover:border-transparent transition-colors duration-200 ease-in-out",
          optimisticLocale === "fr"
            ? "text-grey-darkest font-bold hover:text-grey-darkest hover:bg-transparent"
            : "text-grey-light hover:text-white hover:bg-transparent",
        )}
        aria-label="Français"
      >
        Fr
      </Button>

      <Button
        type="button"
        variant="text"
        color="grey"
        onClick={() => handleToggle("en")}
        disabled={isPending}
        className={twMerge(
          "relative z-10 w-10 h-10 p-0 rounded-full text-xs font-semibold cursor-pointer border-none hover:border-transparent transition-colors duration-200 ease-in-out",
          optimisticLocale === "en"
            ? "text-grey-darkest font-bold hover:text-grey-darkest hover:bg-transparent"
            : "text-grey-light hover:text-white hover:bg-transparent",
        )}
        aria-label="English"
      >
        En
      </Button>
    </Card>
  );
}
