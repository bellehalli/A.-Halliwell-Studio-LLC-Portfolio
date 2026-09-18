import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Fraunces,
  Inter,
  Parisienne,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

const editorial = Fraunces({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

const princess = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-princess",
  display: "swap",
});

const fashion = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-fashion",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "A. Halliwell Studio",
    template: "%s | A. Halliwell Studio",
  },
  description:
    "Independent creative web design and development studio creating custom digital experiences designed around how your business actually works.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${editorial.variable} ${princess.variable} ${fashion.variable} ${sans.variable} ${mono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
