import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Functional Intelligence — You fund it. I break it down.",
  description:
    "A research market. Back the paper, topic, or idea you want explained — the most-funded idea on The Board ships as a 5-minute brief every Tuesday & Thursday, 7am.",
  openGraph: {
    title: "Functional Intelligence — The Board",
    description:
      "You fund it. I break it down. Back the research you want explained. Top idea ships Tue & Thu, 7am.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
