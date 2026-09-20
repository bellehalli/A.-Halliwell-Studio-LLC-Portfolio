import type { Metadata } from "next";
import "./studio-os.css";

export const metadata: Metadata = {
 title: "Studio OS",
 robots: { index: false, follow: false },
};

export default function AdminLayout({children}:{children:React.ReactNode}) {
 return <div className="studio-os-root">{children}</div>;
}
