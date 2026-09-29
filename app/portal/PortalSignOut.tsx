"use client";

export default function PortalSignOut() {
  return <button className="portal-signout" type="button" onClick={async () => {
    await fetch("/api/portal/auth/logout", { method: "POST" });
    window.location.assign("/portal");
  }}>Sign out</button>;
}
