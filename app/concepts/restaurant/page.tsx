import type { Metadata } from "next";
import RestaurantConcept from "@/components/concepts/RestaurantConcept";
export const metadata: Metadata={title:"Sable & Salt Restaurant Concept",description:"Original restaurant web experience concept by A. Halliwell Studio.",robots:{index:false,follow:true}};
export default function Page(){return <RestaurantConcept/>}
