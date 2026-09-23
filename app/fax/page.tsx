import { notFound } from "next/navigation";

export const metadata = {
  title: "A. Halliwell Fax",
  robots: { index: false, follow: false },
};

export default function FaxPage() {
  notFound();
}
