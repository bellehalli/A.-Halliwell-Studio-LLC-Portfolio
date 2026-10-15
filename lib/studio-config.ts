/** Public commercial details. No credentials or client data belong here. */
export const studio = {
  name: "A. Halliwell Studio",
  email: "hello@ahalliwellstudio.com",
  consultationUrl: "https://calendar.app.google/UArjShmAHzt4vGE48",
  offers: { website: "Custom Website", refinement: "Website Refinement", custom: "Custom Scope", support: "Studio Continuity" },
  pricing: { quickFix: 300, launch: 1200, website: 7000, refinement: 2500 },
} as const;
export const dollars = (amount: number) => `$${amount.toLocaleString("en-US")}`;
export const websiteStartingPrice = `Starting at ${dollars(studio.pricing.website)} + scope`;
export const refinementStartingPrice = `Starting at ${dollars(studio.pricing.refinement)} + scope`;
export const pricingSummary = "Quick Fix: $300. One-Page Launch: $1,200. Small Business Site: $2,500. Custom Website: $7,000+. Other custom projects are priced by scope.";
export const serviceOffers = [
  ["Quick Fix", "One problem. A clearer next step.", "$300", "One agreed website issue, such as a mobile layout, contact form or booking-link fix. Reviewed for fit before payment. Delivered in 3–5 business days after access is received; 100% upfront."],
  ["One-Page Launch", "Get your business online.", "$1,200", "One custom, mobile-ready page with hero, services, about, and a simple inquiry form or existing booking link. Client supplies copy, logo and photos. Two revision rounds; about 10 business days after deposit and content."],
  ["Small Business Site", "Give your business room to grow.", "$2,500", "Up to five pages, responsive design, basic SEO setup, and a simple inquiry form or existing booking link. Client supplies content. Two revision rounds; timeline agreed in your proposal."],
  ["Custom Website", "Build around the bigger vision.", "$7,000+", "Custom strategy, design and development for a more extensive website or customer journey. Pages, features, integrations, revisions and timeline are defined in your proposal."],
] as const;
export const servicePaymentTerms = "Quick Fix is paid in full upfront. One-Page Launch and Small Business Site require 50% upfront and 50% before launch or final handoff. Custom Website milestones are defined in your proposal. Domain, hosting, copywriting, e-commerce, new booking systems and custom integrations are quoted separately. Every project has a written scope; additions require a separate quote.";
const shortAmount = (amount: number) => `$${amount / 1000}k`;
export const websiteInvestmentRange = `${shortAmount(studio.pricing.website)}–$10k`;
export const investmentOptions = [
  "$300 · Quick Fix",
  "$1,200 · One-Page Launch",
  "$2,500 · Small Business Site",
  `${shortAmount(studio.pricing.refinement)}–${shortAmount(studio.pricing.website)} · refinement or custom scope`,
  `${websiteInvestmentRange} · custom website`,
  "$10k–$20k · larger build + integrations",
  "$20k+ · advanced custom systems",
  "Custom project · priced by scope",
  "I need help scoping the investment",
];
export const projectReasons = [
  "Launch or relaunch", "Losing inquiries or sales", "Operational bottleneck",
  "Outgrown the current site", "New service or location", "Upcoming event or season", "Another reason",
];
