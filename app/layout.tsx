import type { Metadata } from "next";
import "./globals.css";
import "./credibility.css";
import "./reposition.css";
import "./final-pass.css";
import "./visual-polish.css";
import "./home-world.css";
import "./editorial-type.css";
import "./lab-refinement.css";
import "./work-refinement.css";
export const metadata:Metadata={
 metadataBase:new URL("https://www.ahalliwellstudio.com"),
 title:{default:"A. Halliwell Studio | Web Design, Development & Digital Systems",template:"%s | A. Halliwell Studio"},
 description:"Custom web design, development and digital systems for businesses that need more than a pretty homepage.",
 applicationName:"A. Halliwell Studio",alternates:{canonical:"/"},
 openGraph:{type:"website",url:"/",siteName:"A. Halliwell Studio",title:"A. Halliwell Studio | Web Design, Development & Digital Systems",description:"Custom websites, interactive experiences and business systems built around what the business actually needs the internet to do."},
 twitter:{card:"summary_large_image",title:"A. Halliwell Studio | Web Design, Development & Digital Systems",description:"Custom websites, interactive experiences and business systems built around what the business actually needs the internet to do."}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
