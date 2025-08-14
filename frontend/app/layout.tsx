import type { Metadata } from "next";
import "./globals.css";
import "material-symbols";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Moreau Athéna",
  description: "Portfolio de Moreau Athéna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-black text-white">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
