import { cookies } from "next/headers";
import { hasFaxSession, SESSION_COOKIE } from "@/lib/fax-auth";
import FaxClient from "./FaxClient";
import FaxSignIn from "./FaxSignIn";
import "./fax.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Private Fax Desk | A. Halliwell Studio", robots: { index: false, follow: false } };
export default async function FaxPage() {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  return hasFaxSession(session) ? <FaxClient /> : <FaxSignIn />;
}
