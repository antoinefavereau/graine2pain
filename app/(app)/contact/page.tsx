import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTranslations } from "next-intl/server";

export default async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <div className="flex flex-col min-h-dvh gap-5">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <h1 className="text-7xl font-bold">{t("title")}</h1>
        <p className="text-2xl font-light">{t("soon")}</p>
      </div>
      <Footer />
    </div>
  );
}
