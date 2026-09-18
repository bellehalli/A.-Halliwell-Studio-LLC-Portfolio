import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A. Halliwell Studio",
  description:
    "Independent creative web design and development studio.",
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
