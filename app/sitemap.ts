import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
const baseUrl="https://ahalliwellstudio.com";
export default function sitemap():MetadataRoute.Sitemap{const r=["","/work","/services","/studio","/lab","/resources","/newsletter","/start"];return[...r.map((p,i)=>({url:`${baseUrl}${p}`,lastModified:new Date(),changeFrequency:(i===0?"weekly":"monthly") as "weekly"|"monthly",priority:i===0?1:.8})),...projects.map(p=>({url:`${baseUrl}/work/${p.slug}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:.9}))]}
