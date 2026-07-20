import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

const mono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono-ui",
});

export const metadata: Metadata = {
  title: "Functional Intelligence — Hard ideas, made legible.",
  description:
    "A free weekly brief that breaks one hard topic down to its underlying assumptions — every Tuesday, 7am ET. Fund a topic, or commission a custom research blueprint.",
  openGraph: {
    title: "Functional Intelligence — Hard ideas, made legible.",
    description:
      "A free weekly brief that breaks one hard topic down to its underlying assumptions — every Tuesday, 7am ET. Fund a topic, or commission a custom research blueprint.",
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
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
