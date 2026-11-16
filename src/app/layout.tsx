import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/shell.css";
import "@/styles/ui.css";
import "@/styles/path.css";
import "@/styles/lesson.css";
import "@/styles/overlays.css";
import "@/styles/pages.css";

// Polices d’origine, servies localement par next/font (variables reprises dans tokens.css).
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  title: "Jalon",
  description: "Révisions JavaScript et React, un peu chaque jour.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
