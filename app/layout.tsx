import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
