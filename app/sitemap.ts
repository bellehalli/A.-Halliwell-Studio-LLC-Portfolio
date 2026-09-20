import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
const baseUrl="https://ahalliwellstudio.com";
export default function sitemap():MetadataRoute.Sitemap{return[
 {url:baseUrl,lastModified:new Date(),changeFrequency:"weekly",priority:1},
 {url:`${baseUrl}/work`,lastModified:new Date(),changeFrequency:"monthly",priority:.9},
 ...projects.map(p=>({url:`${baseUrl}/work/${p.slug}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.8}))
]}
