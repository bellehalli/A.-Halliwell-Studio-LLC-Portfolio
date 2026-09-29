import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import Preview from "./Preview";

export const metadata: Metadata = { title: "Payment journey preview", robots: { index: false, follow: false } };
export default function Page() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return <main className="portal-page"><div className="site-background" aria-hidden="true"/><Navigation/><Preview/></main>;
}
