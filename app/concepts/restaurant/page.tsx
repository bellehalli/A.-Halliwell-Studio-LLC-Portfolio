import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import RestaurantConcept from "@/components/concepts/RestaurantConcept";
import { getProject } from "@/data/projects";
import { notFound } from "next/navigation";
export function generateMetadata(): Metadata {
  if (getProject("sable-and-salt")?.inDevelopment !== false) return { title: "Page Not Found", robots: { index: false, follow: false } };
  return {title:"Sable & Salt Restaurant Concept",description:"Original restaurant web experience concept by A. Halliwell Studio.",robots:{index:false,follow:true},alternates:{canonical:"/concepts/restaurant"},...socialMetadata("/concepts/restaurant","Sable & Salt Restaurant Concept","Original restaurant web experience concept by A. Halliwell Studio.")};
}
export default function Page(){if(getProject("sable-and-salt")?.inDevelopment !== false) notFound();return <RestaurantConcept/>}
