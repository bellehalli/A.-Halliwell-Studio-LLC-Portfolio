import type { Metadata } from "next";
import { Bodoni_Moda, Fraunces, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import "./credibility.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-fashion",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahalliwellstudio.com"),
  title: {
    default: "A. Halliwell Studio | Wedding Venue Web Design & Development",
    template: "%s | A. Halliwell Studio",
  },
  description:
    "Custom strategy, web design and development for wedding venues and hospitality brands that want a more distinctive digital experience and clearer inquiry paths.",
  applicationName: "A. Halliwell Studio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "A. Halliwell Studio",
    title: "A. Halliwell Studio | Wedding Venue Web Design & Development",
    description:
      "Custom websites and digital experiences for wedding venues and hospitality brands.",
  },
  twitter: {
    card: "summary_large_image",
    title: "A. Halliwell Studio | Wedding Venue Web Design & Development",
    description:
      "Custom websites and digital experiences for wedding venues and hospitality brands.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${bodoni.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
