import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import CommerceConcept from "@/components/concepts/CommerceConcept";
export const metadata: Metadata={title:"Muse Room E-commerce Concept",description:"Original e-commerce web experience concept by A. Halliwell Studio.",robots:{index:false,follow:true},alternates:{canonical:"/concepts/commerce"},...socialMetadata("/concepts/commerce","Muse Room E-commerce Concept","Original e-commerce web experience concept by A. Halliwell Studio.")};
export default function Page(){return <CommerceConcept/>}
