import type { Metadata } from "next";
import { Bodoni_Moda,Fraunces,Inter,Space_Mono } from "next/font/google";
import "./globals.css";
import "./credibility.css";
import "./reposition.css";
const fraunces=Fraunces({subsets:["latin"],variable:"--font-editorial",display:"swap"});
const bodoni=Bodoni_Moda({subsets:["latin"],variable:"--font-fashion",display:"swap"});
const inter=Inter({subsets:["latin"],variable:"--font-sans",display:"swap"});
const spaceMono=Space_Mono({weight:["400","700"],subsets:["latin"],variable:"--font-mono",display:"swap"});
export const metadata:Metadata={
 metadataBase:new URL("https://ahalliwellstudio.com"),
 title:{default:"A. Halliwell Studio | Web Design, Development & Digital Systems",template:"%s | A. Halliwell Studio"},
 description:"Custom web design, development and digital systems for businesses that need more than a pretty homepage.",
 applicationName:"A. Halliwell Studio",alternates:{canonical:"/"},
 openGraph:{type:"website",url:"/",siteName:"A. Halliwell Studio",title:"A. Halliwell Studio | Web Design, Development & Digital Systems",description:"Custom websites, interactive experiences and business systems built around what the business actually needs the internet to do."},
 twitter:{card:"summary_large_image",title:"A. Halliwell Studio | Web Design, Development & Digital Systems",description:"Custom websites, interactive experiences and business systems built around what the business actually needs the internet to do."},
 robots:{index:true,follow:true,googleBot:{index:true,follow:true}}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${fraunces.variable} ${bodoni.variable} ${inter.variable} ${spaceMono.variable}`}><body>{children}</body></html>}
