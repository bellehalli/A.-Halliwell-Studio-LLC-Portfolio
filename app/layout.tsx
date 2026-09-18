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
  metadataBase: new URL("https://ahalliwellstudio.com"),

  title: {
    default: "A. Halliwell Studio | Web Design & Development",
    template: "%s | A. Halliwell Studio",
  },

  description:
    "Independent creative web design and development studio building custom websites, digital experiences, booking systems, e-commerce experiences, and business systems.",

  applicationName: "A. Halliwell Studio",

  alternates: {
    canonical: "/",
  },

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
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
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
