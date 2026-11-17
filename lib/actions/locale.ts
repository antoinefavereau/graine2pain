"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { locales, type Locale } from "@/i18n/request";

export async function setLocaleAction(newLocale: Locale) {
  if (!locales.includes(newLocale)) return;

  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", newLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
