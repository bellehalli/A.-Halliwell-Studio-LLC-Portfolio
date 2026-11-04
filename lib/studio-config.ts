/** Public commercial details. No credentials or client data belong here. */
export const studio = {
  name: "A. Halliwell Studio",
  email: "hello@ahalliwellstudio.com",
  consultationUrl: "https://calendar.app.google/UArjShmAHzt4vGE48",
  offers: { website: "Custom Website", refinement: "Website Enhancement", custom: "Custom Scope", support: "Studio Continuity" },
  pricing: { quickFix: 350, leadCapture: 499, enhancement: 699, launch: 1200, smallBusiness: 2500, businessPlus: 5000, website: 7000, refinement: 699 },
} as const;
export const dollars = (amount: number) => `$${amount.toLocaleString("en-US")}`;
export const websiteStartingPrice = `Starting at ${dollars(studio.pricing.website)} + scope`;
export const refinementStartingPrice = `Starting at ${dollars(studio.pricing.refinement)} + scope`;
export const pricingSummary = "Quick Fix: $350. Lead Capture Installation: $499. Website Enhancement: $699. One-Page Launch: $1,200. Small Business Website (up to 3 pages): $2,500+. Business Website Plus (up to 5 pages): $5,000+. Custom Website (6+ pages): $7,000+. Final prices depend on scope.";
export const serviceOffers = [
  ["Website Quick Fix", "Resolve the small things that matter.", "$350", "Up to three minor corrections to an existing accessible website, such as hours, links, text, images or calls to action. Scope and technical feasibility are confirmed before work begins."],
  ["Lead Capture Installation", "Make it easier to get inquiries.", "$499", "One customer inquiry or service-request form, email notifications, a confirmation message and a tested submission workflow. Existing website access and compatibility required."],
  ["Website Enhancement", "Make an existing page work harder.", "$699", "Refresh one existing page's layout, approved imagery, content hierarchy and calls to action. More extensive redesigns are separately scoped."],
  ["One-Page Website Launch", "Get your business online.", "$1,200", "One responsive page with service sections, contact information, a simple inquiry form and basic search setup. Client supplies approved content and brand assets."],
  ["Small Business Website", "A focused home for your business.", "$2,500+", "Up to three pages, responsive design, basic search setup and a simple inquiry pathway. Features and final price depend on scope."],
  ["Business Website Plus", "More space for what you offer.", "$5,000+", "Up to five pages with responsive design and an agreed customer journey. Content, features and integrations are scoped in the proposal."],
  ["Custom Website", "Build around the bigger vision.", "$7,000+", "Six or more pages with custom strategy, design and development. Page count, functionality, integrations, revisions and schedule are defined in the proposal."],
] as const;
export const servicePaymentTerms = "Standard projects require a 50% deposit before work begins and the remaining 50% before launch or final handoff. Every project receives a written scope and estimated schedule. Hosting, domains, paid assets, third-party subscriptions, copywriting, e-commerce, advanced booking and custom integrations may cost extra. Additional work requires a separate quote.";
const shortAmount = (amount: number) => `$${amount / 1000}k`;
export const websiteInvestmentRange = `${shortAmount(studio.pricing.website)}–$10k`;
export const investmentOptions = [
  "$350 · Website Quick Fix",
  "$499 · Lead Capture Installation",
  "$699 · Website Enhancement",
  "$1,200 · One-Page Website Launch",
  "$2,500+ · Small Business Website (up to 3 pages)",
  "$5,000+ · Business Website Plus (up to 5 pages)",
  "$7,000+ · Custom Website (6+ pages)",
  "$10k–$20k · larger build + integrations",
  "$20k+ · advanced custom systems",
  "Custom project · priced by scope",
  "I need help scoping the investment",
];
export const projectReasons = [
  "Launch or relaunch", "Losing inquiries or sales", "Operational bottleneck",
  "Outgrown the current site", "New service or location", "Upcoming event or season", "Another reason",
];
