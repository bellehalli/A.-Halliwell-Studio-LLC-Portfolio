export const GA_ID = "G-Y7M12CX6VL";
export const GA_CONSENT_KEY = "ahs-google-analytics-consent";
export const isPrivateAnalyticsPath = (path: string) => /^\/(portal|fax|api|admin|dashboard|checkout|onboarding)(?:\/|$)/.test(path);

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean | undefined };
export function googleEvent(name: string, properties: Record<string, string> = {}) {
  if (typeof window === "undefined" || isPrivateAnalyticsPath(window.location.pathname)) return;
  try {
    if (localStorage.getItem(GA_CONSENT_KEY) !== "granted") return;
    const analyticsWindow = window as unknown as AnalyticsWindow;
    analyticsWindow.gtag?.("event", name, { ...properties, send_to: GA_ID, page_location: window.location.origin + window.location.pathname });
  } catch { /* Measurement must never interrupt the site. */ }
}
export function disableGoogleAnalytics() {
  const analyticsWindow = window as unknown as AnalyticsWindow;
  analyticsWindow[`ga-disable-${GA_ID}`] = true;
  analyticsWindow.gtag?.("consent", "update", { analytics_storage: "denied" });
  for (const entry of document.cookie.split(";")) {
    const name = entry.trim().split("=")[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of ["", window.location.hostname, ".ahalliwellstudio.com"]) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""} SameSite=Lax; Secure`;
    }
  }
}
export function enableGoogleAnalytics() {
  if (isPrivateAnalyticsPath(window.location.pathname)) return;
  try { if (localStorage.getItem(GA_CONSENT_KEY) !== "granted") return; } catch { return; }
  const analyticsWindow = window as unknown as AnalyticsWindow;
  analyticsWindow[`ga-disable-${GA_ID}`] = false;
  if (analyticsWindow.gtag) {
    analyticsWindow.gtag("set", { page_location: window.location.origin + window.location.pathname, page_title: document.title });
    analyticsWindow.gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag = function () { analyticsWindow.dataLayer!.push(arguments); };
  analyticsWindow.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  analyticsWindow.gtag("js", new Date());
  let referrer = "";
  try { const url = new URL(document.referrer); if (!isPrivateAnalyticsPath(url.pathname)) referrer = url.origin; } catch { /* No referrer. */ }
  const query = new URLSearchParams(window.location.search);
  const source = query.get("utm_source") || "";
  const campaign = source === "outreach" && query.get("utm_campaign") === "october_12_14"
    ? { campaign_source: "outreach", campaign_medium: "email", campaign_name: "october_12_14" } : {};
  analyticsWindow.gtag("config", GA_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: window.location.origin + window.location.pathname, page_referrer: referrer, cookie_expires: 60 * 60 * 24 * 90, ...campaign });
  const script = document.createElement("script");
  script.id = "ahs-google-analytics";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}
