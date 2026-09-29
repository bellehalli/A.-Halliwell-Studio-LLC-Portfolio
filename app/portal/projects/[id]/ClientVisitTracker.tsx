"use client";
import { useEffect } from "react";
export default function ClientVisitTracker({ projectId }: { projectId: string }) {
  useEffect(() => {
    void fetch("/api/portal/visit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId }) }).catch(() => {});
  }, [projectId]);
  return null;
}
