import type { Metadata } from "next";
import { Bodoni_Moda, Fraunces, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-editorial", display: "swap" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-fashion", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ahalliwellstudio.com"),
  title: { default: "A. Halliwell Studio | Digital Design, Development & Systems", template: "%s | A. Halliwell Studio" },
  description: "Independent digital design, development and systems studio creating distinctive internet experiences and the infrastructure behind them.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "A. Halliwell Studio", title: "A. Halliwell Studio", description: "Digital experiences designed around how the business actually works." },
  twitter: { card: "summary_large_image", title: "A. Halliwell Studio", description: "Digital experiences designed around how the business actually works." }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${fraunces.variable} ${bodoni.variable} ${inter.variable} ${spaceMono.variable}`}><body>{children}</body></html>;
}
