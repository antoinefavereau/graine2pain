import type { Metadata } from "next";
import { Julius_Sans_One } from "next/font/google";
import "./globals.css";
import "material-symbols";

const juliusSansOne = Julius_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-julius",
});

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
      <body
        className={`antialiased bg-black text-white ${juliusSansOne.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
