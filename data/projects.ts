export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  url: string;
  embedUrl?: string;
  tone: "willow" | "maison" | "vanta" | "elan" | "northstar" | "restaurant" | "commerce";
  details: string[];
  desktopAsset?: string;
  mobileAsset?: string;
  brief: string;
  challenge: string;
  strategy: string;
  approach: string[];
  outcome: string;
  evidence: string[];
  livePreview?: boolean;
  disclosure: string;
};

export const projects: Project[] = [
  {
    slug: "willow-lily",
    number: "01",
    name: "Willow Lily",
    category: "Hospitality / Weddings / Custom Experience",
    description: "A digital-first tour of a luxury inn and wedding estate, designed to help couples understand the property, picture the weekend and move toward inquiry with confidence.",
    url: "https://willowlilyestate.com",
    embedUrl: "https://willowlily.ahalliwellstudio.com",
    tone: "willow",
    details: ["Venue Strategy", "Custom Development", "Interactive Systems"],
    desktopAsset: "/projects/willow-lily/desktop/willow-entry-screen.PNG",
    mobileAsset: "/projects/willow-lily/desktop/willow-contact-form.PNG",
    brief: "Create a premium hospitality experience that feels like the beginning of the venue tour, not a brochure. The site needed to explain the estate, weekend stay, ceremony possibilities, investment and planning details without making the visitor hunt for answers.",
    challenge: "Luxury venue websites often ask couples to fall in love with a property while giving them fragmented information about the actual experience. The concept needed to preserve romance without sacrificing clarity.",
    strategy: "Treat the website as a guided venue tour. Lead with atmosphere, then progressively answer the practical questions that determine whether a couple feels ready to inquire.",
    approach: ["Digital first-tour structure", "Interactive estate map", "Weekend and wedding planning flows", "Clear investment and inquiry paths"],
    outcome: "A conversion-focused demonstration of how a luxury venue can connect storytelling, planning information and custom interaction in one cohesive guest journey.",
    evidence: ["/projects/willow-lily/desktop/willow-entry-screen.PNG", "/projects/willow-lily/desktop/willow-estate-map.PNG", "/projects/willow-lily/desktop/willow-contact-form.PNG"],
    livePreview: true,
    disclosure: "Original studio concept. Fictional venue brand. No measured business results are claimed."
  },
  {
    slug: "maison-riviere",
    number: "02",
    name: "Maison Rivière",
    category: "Hospitality / Events / Digital Presence",
    description: "An editorial hospitality concept designed to make the venue feel considered before a guest ever walks through the door, while keeping tours and inquiry easy to reach.",
    url: "https://www.maisonrivieredetroit.com",
    embedUrl: "https://maison.ahalliwellstudio.com",
    tone: "maison",
    details: ["Experience Design", "Development", "Hospitality UX"],
    desktopAsset: "/projects/maison-riviere/desktop/maison-homepage-hero.PNG",
    mobileAsset: "/projects/maison-riviere/desktop/maison-tour-inquiry.PNG",
    brief: "Translate an event and hospitality brand into a digital presence that feels editorial, distinctive and useful. The experience needed to support real customer decisions without losing the mood of the venue.",
    challenge: "A visually strong venue can lose impact online when atmosphere and information live in separate worlds. The concept needed to hold onto the brand while making exploration and action straightforward.",
    strategy: "Use editorial pacing to build desire, then anchor each stage with a clear decision path so the visitor never has to choose between inspiration and information.",
    approach: ["Editorial presentation", "Hospitality-first navigation", "Responsive custom development", "Tour and inquiry pathways"],
    outcome: "A studio demonstration showing how a hospitality brand can feel expressive without making the customer work to understand what to do next.",
    evidence: ["/projects/maison-riviere/desktop/maison-homepage-hero.PNG", "/projects/maison-riviere/desktop/maison-wedding-builder.PNG", "/projects/maison-riviere/desktop/maison-tour-inquiry.PNG"],
    livePreview: true,
    disclosure: "Original studio concept. Fictional venue brand. No measured business results are claimed."
  },
  {
    slug: "vanta-social",
    number: "03",
    name: "Vanta Social",
    category: "Nightlife / Events / Guest Conversion",
    description: "A nightlife platform that gives guests one clear place to discover events, join a guest list, understand arrival details and move into VIP without hunting across social media.",
    url: "https://vantanightclubdetroit.com",
    tone: "vanta",
    details: ["Event Discovery", "VIP Conversion", "Guest List UX", "Responsive Development"],
    brief: "Build a nightlife website that does more than establish mood. Guests should be able to answer the practical question behind every night out: what is happening, how do I get in and what are my options?",
    challenge: "Nightlife information is often fragmented across flyers, promoters, ticket links and social posts. That creates friction right when a guest is ready to act.",
    strategy: "Turn the website into the operating hub for the night: events, guest list, VIP, venue information and direct action paths in one system.",
    approach: ["Event-first navigation", "Guest-list and VIP pathways", "Arrival information architecture", "Mobile-first nightlife UX"],
    outcome: "A working multi-page nightlife concept that demonstrates event discovery, guest acquisition and premium upsell paths without relying on social media as the primary customer journey.",
    evidence: [],
    livePreview: true,
    disclosure: "Original studio concept. Fictional nightlife brand. Forms and pricing are demonstrative."
  },
  {
    slug: "elan-aesthetics",
    number: "04",
    name: "Élan Aesthetics",
    category: "Beauty / Wellness / Booking Experience",
    description: "A finished aesthetic-medicine concept built around treatment discovery, consultation booking, memberships, financing context and a calmer path from interest to appointment.",
    url: "https://elan.ahalliwellstudio.com",
    tone: "elan",
    details: ["Treatment Discovery", "Booking UX", "Memberships", "Conversion Design"],
    brief: "Create a beauty and wellness experience that feels polished while helping a prospective client move from a concern to the right treatment, understand options and book a consultation.",
    challenge: "Aesthetics websites can overwhelm visitors with treatment names before helping them understand what applies to their concern, budget or desired result.",
    strategy: "Start with the visitor's goal, then organize treatments, memberships, financing information and booking around the decisions they actually need to make.",
    approach: ["Concern-led treatment discovery", "Consultation-first booking", "Membership and financing context", "Editorial responsive design"],
    outcome: "A finished multi-page wellness concept that demonstrates how education, trust and conversion can live in the same customer journey.",
    evidence: [],
    livePreview: true,
    disclosure: "Original studio concept. Fictional aesthetics brand. No medical services are offered and all business details are illustrative."
  },
  {
    slug: "northstar-heating-home",
    number: "05",
    name: "Northstar Heating & Home",
    category: "Local Service / HVAC / Lead Generation",
    description: "A finished local-service website that routes homeowners from urgent problems to the right service, estimate, maintenance or replacement path without making them decode contractor jargon.",
    url: "https://northstar.ahalliwellstudio.com",
    tone: "northstar",
    details: ["Lead Generation", "Service Routing", "Local SEO Structure", "Conversion UX"],
    brief: "Build a home-service website that works in both urgent and planned situations, from no-heat calls to maintenance and replacement research.",
    challenge: "Homeowners often arrive stressed and need the fastest possible route to the right next step. A traditional services list can force them to diagnose the problem themselves.",
    strategy: "Organize the site around homeowner problems and intent, then connect those entry points to services, booking, estimates and supporting trust information.",
    approach: ["Problem-first routing", "Service request pathways", "Seasonal and local content structure", "Repair-versus-replace education"],
    outcome: "A finished multi-page HVAC concept showing how practical information architecture and conversion design can support a local service business across urgent and research-driven journeys.",
    evidence: [],
    livePreview: true,
    disclosure: "Original studio concept. Fictional HVAC company. Contact details, ratings, credentials and pricing are illustrative."
  },
  {
    slug: "sable-and-salt",
    number: "06",
    name: "Sable & Salt",
    category: "Restaurant / Reservations / Menu UX",
    description: "A restaurant concept that helps guests move from appetite to decision with a focused reservation path, service-aware menu browsing and a mobile-first evening-out flow.",
    url: "/concepts/restaurant",
    tone: "restaurant",
    details: ["Reservation UX", "Menu Discovery", "Hospitality Design", "Responsive Prototype"],
    brief: "Create a restaurant experience that makes choosing a night, understanding the menu and reserving a table feel immediate instead of buried under atmosphere-only design.",
    challenge: "Restaurant sites often separate the emotional sell from the practical decision. Guests should not need three platforms to answer what to eat, when to come and how to reserve.",
    strategy: "Keep the mood, but place menu discovery and reservation intent directly inside the browsing experience.",
    approach: ["Reservation-first hero", "Dietary menu filters", "Dinner-service information", "Mobile-first interaction"],
    outcome: "A compact live concept that demonstrates restaurant-specific interaction without requiring a full fictional operations stack.",
    evidence: [],
    livePreview: true,
    disclosure: "Original studio concept. Fictional restaurant. Reservations and menu items are demonstration content."
  },
  {
    slug: "muse-room",
    number: "07",
    name: "Muse Room",
    category: "E-commerce / Fashion / Shopping UX",
    description: "A fashion-commerce concept built around fast product comparison, variant selection, cart feedback and a cleaner route from browsing to purchase.",
    url: "/concepts/commerce",
    tone: "commerce",
    details: ["E-commerce UX", "Product Discovery", "Cart Interaction", "Responsive Prototype"],
    brief: "Build a compact commerce experience that proves the studio can design around product decisions, not just brand presentation.",
    challenge: "A visually strong store can still lose the sale when product information, variants and cart state feel disconnected or slow.",
    strategy: "Make each interaction visibly move the shopper forward: filter, compare, choose a size, add to bag and see the state change immediately.",
    approach: ["Product filtering", "Variant selection", "Live cart state", "Editorial commerce design"],
    outcome: "A live e-commerce concept showing product discovery and cart behavior inside a deliberately small, polished prototype.",
    evidence: [],
    livePreview: true,
    disclosure: "Original studio concept. Fictional fashion shop. No real purchases are processed."
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
