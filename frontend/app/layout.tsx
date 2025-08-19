import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "material-symbols";
import DirectionalTransitionsProvider from "@/components/directional-transitions-provider";

const juliusSansOne = localFont({
  src: "../public/fonts/JuliusSansOne-Regular.ttf",
  variable: "--font-julius",
});

const archivo = localFont({
  src: "../public/fonts/Archivo.ttf",
  variable: "--font-heading",
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
        className={`${juliusSansOne.variable} ${archivo.variable} antialiased bg-black text-white`}
      >
        <DirectionalTransitionsProvider>
          {children}
        </DirectionalTransitionsProvider>
      </body>
    </html>
  );
}
