import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Functional Intelligence — Hard ideas, made legible.",
  description:
    "A free weekly brief that breaks one hard topic down to its underlying assumptions — every Tuesday, 7am ET. Fund a topic, or put our writing under your name.",
  openGraph: {
    title: "Functional Intelligence — Hard ideas, made legible.",
    description:
      "A free weekly brief that breaks one hard topic down to its underlying assumptions — every Tuesday, 7am ET. Fund a topic, or put our writing under your name.",
    siteName: "Functional Intelligence",
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#101d30"/><text x="32" y="44" font-family="Georgia,serif" font-size="34" fill="#e8b452" text-anchor="middle"><tspan font-style="italic">f</tspan> i</text></svg>`
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
