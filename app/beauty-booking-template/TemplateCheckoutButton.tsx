"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function TemplateCheckoutButton({ slug, label, className }: { slug: string; label: string; className: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function beginCheckout() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/templates/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.url !== "string") throw new Error(data.message || "Checkout could not open. Please try again.");
      window.location.assign(data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout could not open. Please try again.");
      setLoading(false);
    }
  }

  return <>
    <button type="button" className={className} onClick={beginCheckout} disabled={loading} aria-busy={loading}>
      {loading ? "OPENING SECURE CHECKOUT…" : label}
    </button>
    {error && <span role="alert" className={styles.checkoutError}>{error}</span>}
  </>;
}
