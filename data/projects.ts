export type Project = {
  slug: "willow-lily" | "maison-riviere";
  number: string;
  name: string;
  category: string;
  description: string;
  url: string;
  disciplines: string[];
  brief: string;
  problem: string;
  strategy: string[];
  system: string[];
  build: string[];
  verifiedResult: string;
};

export const projects: Project[] = [
  {
    slug: "willow-lily",
    number: "01",
    name: "Willow Lily",
    category: "Hospitality / Weddings / Custom Experience",
    description: "A conversion-focused digital experience for a luxury inn and wedding venue, designed to turn browsing into confident inquiry.",
    url: "https://willowlilyestate.com",
    disciplines: ["UX Strategy", "Custom Development", "Interactive Systems"],
    brief: "Create a hospitality website that explains the property, weekend experience and wedding offer without flattening the venue into a generic gallery site.",
    problem: "Premium venue prospects need to understand fit, flow, inclusions and next steps before they are ready to inquire. A photo-first site can create interest without creating decision clarity.",
    strategy: [
      "Organize the experience around the guest journey rather than an internal page list.",
      "Surface practical decision information earlier, including capacity, stay, ceremony settings and package context.",
      "Use interactive pathways to help a visitor move from browsing to a more qualified inquiry."
    ],
    system: [
      "Availability interaction",
      "Build-your-weekend flow",
      "Choose-a-moment timeline",
      "Interactive estate map",
      "Inclusions and planning content",
      "Tour scheduling pathway"
    ],
    build: [
      "Responsive custom front end",
      "Structured navigation and inquiry paths",
      "Reusable interaction patterns",
      "SEO-ready page architecture"
    ],
    verifiedResult: "The live public website is the verifiable project artifact. No conversion metric is claimed without source data."
  },
  {
    slug: "maison-riviere",
    number: "02",
    name: "Maison Rivière",
    category: "Hospitality / Events / Digital Presence",
    description: "An elevated hospitality website built to make the experience feel considered before a guest ever walks through the door.",
    url: "https://www.maisonrivieredetroit.com",
    disciplines: ["Web Design", "Development", "Hospitality UX"],
    brief: "Translate an event and hospitality concept into a digital presence that feels intentional, easy to explore and ready to support real customer decisions.",
    problem: "A hospitality site has to communicate atmosphere while still helping visitors understand the offer and take action.",
    strategy: [
      "Use editorial structure to establish mood without sacrificing navigation clarity.",
      "Keep decision paths visible throughout the experience.",
      "Treat responsive behavior as part of the composition, not a fallback."
    ],
    system: [
      "Event-focused information architecture",
      "Responsive content hierarchy",
      "Conversion pathways",
      "Reusable editorial sections"
    ],
    build: [
      "Custom responsive front end",
      "Reusable layout primitives",
      "Metadata and SEO foundation",
      "Live public deployment"
    ],
    verifiedResult: "The live public website is the verifiable project artifact. No performance or revenue claim is presented without traceable source data."
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
