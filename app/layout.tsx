import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ahalliwellstudio.com"),
  title: "A. Halliwell Studio",
  description: "Digital design, development, and systems studio.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "A. Halliwell Studio",
    description: "Digital design, development, and systems studio.",
    url: "/"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "A. Halliwell Studio",
    "url": "https://ahalliwellstudio.com"
  };

  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
        {children}
      </body>
    </html>
  );
}
