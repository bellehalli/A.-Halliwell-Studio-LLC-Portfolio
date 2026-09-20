import type { Metadata } from "next";
import { Bodoni_Moda, Fraunces, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

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
    default: "A. Halliwell Studio | Web Design & Development",
    template: "%s | A. Halliwell Studio",
  },
  description:
    "Independent creative web design and development studio building custom websites, digital experiences, booking systems, e-commerce experiences, and business systems.",
  applicationName: "A. Halliwell Studio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "A. Halliwell Studio",
    title: "A. Halliwell Studio | Web Design & Development",
    description:
      "Custom websites and digital experiences designed around how your business actually works.",
  },
  twitter: {
    card: "summary_large_image",
    title: "A. Halliwell Studio | Web Design & Development",
    description:
      "Custom websites and digital experiences designed around how your business actually works.",
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
