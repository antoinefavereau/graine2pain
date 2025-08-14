import type { Metadata } from "next";
import "./globals.css";
import "material-symbols";

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
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}
