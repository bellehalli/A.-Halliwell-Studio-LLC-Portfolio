import type { Metadata } from "next";
import StartProject from "@/components/forms/StartProject";
import SceneProps from "@/components/visual/SceneProps";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Start a Project",
  description: "Start a custom website, redesign, e-commerce, booking, portal or digital-system project with A. Halliwell Studio.",
  alternates: { canonical: "/start" },
};

export default function Page() {
  return <main className="destination-page start-route"><div className="site-background" aria-hidden="true"/><Navigation /><div className="start-route-wrap"><SceneProps scene="start"/><StartProject /></div></main>;
}
