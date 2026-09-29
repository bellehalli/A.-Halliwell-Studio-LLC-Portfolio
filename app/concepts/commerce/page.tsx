import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import CommerceConcept from "@/components/concepts/CommerceConcept";
import { getProject } from "@/data/projects";
import { notFound } from "next/navigation";
export function generateMetadata(): Metadata {
  if (getProject("muse-room")?.inDevelopment !== false) return { title: "Page Not Found", robots: { index: false, follow: false } };
  return {title:"Muse Room E-commerce Concept",description:"Original e-commerce web experience concept by A. Halliwell Studio.",robots:{index:false,follow:true},alternates:{canonical:"/concepts/commerce"},...socialMetadata("/concepts/commerce","Muse Room E-commerce Concept","Original e-commerce web experience concept by A. Halliwell Studio.")};
}
export default function Page(){if(getProject("muse-room")?.inDevelopment !== false) notFound();return <CommerceConcept/>}
