import Navbar from "@/components/Navbar";
import { getTranslations } from "next-intl/server";

export default async function About() {
  const t = await getTranslations("About");

  return (
    <div className="flex flex-col min-h-dvh gap-5">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <h1 className="text-7xl font-bold">{t("title")}</h1>
        <p className="text-2xl font-light">{t("soon")}</p>
      </div>
    </div>
  );
}
