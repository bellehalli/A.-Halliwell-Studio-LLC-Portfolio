import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A. Halliwell Studio",
  description: "Independent creative web design and development studio building custom digital experiences around how businesses actually work."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
