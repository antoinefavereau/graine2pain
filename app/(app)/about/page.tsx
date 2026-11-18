import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BacklightTitle from "@/components/about/BacklightTitle";

export async function generateMetadata() {
  const t = await getTranslations("About");
  return {
    title: `${t("title")} — Athéna Moreau`,
    description: t("description"),
  };
}

export default async function About() {
  const t = await getTranslations("About");

  return (
    <div className="min-h-dvh relative flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-12 md:py-20 w-full">
        <div className="flex flex-col items-start gap-6 md:gap-8">
          <BacklightTitle firstName={t("firstName")} lastName={t("lastName")} />
          <p className="text-lg sm:text-xl md:text-2xl text-grey-base">
            {t("role")}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
