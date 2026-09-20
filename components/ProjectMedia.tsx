"use client";
import { useState } from "react";
type Props = { desktop: string; mobile: string; name: string };
export default function ProjectMedia({ desktop, mobile, name }: Props) {
  const [desktopReady, setDesktopReady] = useState(false);
  const [mobileReady, setMobileReady] = useState(false);
  return (
    <div className="device-composition">
      <div className="browser-card">
        <div className="browser-top"><span/><span/><span/><div>Live project preview</div></div>
        <div className={`asset-slot ${desktopReady ? "has-project-image" : ""}`}>
          <img src={desktop} alt={`${name} desktop website preview`} onLoad={() => setDesktopReady(true)} onError={() => setDesktopReady(false)} />
          {!desktopReady && <div className="asset-fallback"><small>LIVE PROJECT</small><strong>{name}</strong><em>Built for real life.</em></div>}
        </div>
      </div>
      <div className={`phone-card ${mobileReady ? "has-project-image" : ""}`} aria-label={`${name} mobile website preview`}>
        <div className="phone-notch"/>
        <img src={mobile} alt="" onLoad={() => setMobileReady(true)} onError={() => setMobileReady(false)} />
        {!mobileReady && <div className="phone-fallback">{name}<small>mobile</small></div>}
      </div>
    </div>
  );
}
