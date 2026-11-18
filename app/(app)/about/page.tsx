import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import About from "@/components/about/About";

export async function generateMetadata() {
  const t = await getTranslations("About");
  return {
    title: `${t("title")} — Athéna Moreau`,
    description: t("description"),
  };
}

export default async function AboutPage() {
  return (
    <div className="relative flex flex-col justify-between overflow-x-hidden">
      <main className="w-full">
        <About />
      </main>

      <Footer />
    </div>
  );
}
