/** Public commercial details. No credentials or client data belong here. */
export const studio = {
  name: "A. Halliwell Studio",
  email: "hello@ahalliwellstudio.com",
  consultationUrl: "https://calendar.app.google/UArjShmAHzt4vGE48",
  offers: { website: "Custom Website", refinement: "Website Refinement", custom: "Custom Scope", support: "Studio Continuity" },
  pricing: { website: 7000, refinement: 2500 },
} as const;
export const dollars = (amount: number) => `$${amount.toLocaleString("en-US")}`;
export const websiteStartingPrice = `Starting at ${dollars(studio.pricing.website)} + scope`;
export const refinementStartingPrice = `Starting at ${dollars(studio.pricing.refinement)} + scope`;
export const pricingSummary = `${studio.offers.refinement} starts at ${dollars(studio.pricing.refinement)}. Custom websites start at ${dollars(studio.pricing.website)}. Other custom projects are priced by scope.`;
const shortAmount = (amount: number) => `$${amount / 1000}k`;
export const websiteInvestmentRange = `${shortAmount(studio.pricing.website)}–$10k`;
export const investmentOptions = [
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
