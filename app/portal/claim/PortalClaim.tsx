"use client";

import { useEffect, useState } from "react";

export default function PortalClaim() {
  const [message, setMessage] = useState("Checking your private link…");
  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
    window.history.replaceState(null, "", "/portal/claim");
    if (!token) { setMessage("This link is missing its sign-in code. Request a new one from the portal."); return; }
    let active = true;
    fetch("/api/portal/auth/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
      .then(async response => { if (!response.ok) throw new Error(); const result = await response.json(); if (active) window.location.replace(result.redirectTo || "/portal"); })
      .catch(() => { if (active) setMessage("This link expired or has already been used. Request a fresh one from the portal."); });
    return () => { active = false; };
  }, []);
  return <p role="status">{message} <a href="/portal">Back to portal</a></p>;
}
