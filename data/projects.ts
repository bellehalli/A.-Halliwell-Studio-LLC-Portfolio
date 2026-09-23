export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  url: string;
  tone: "willow" | "maison";
  details: string[];
  desktopAsset: string;
  mobileAsset: string;
  brief: string;
  challenge: string;
  strategy: string;
  approach: string[];
  outcome: string;
  evidence: string[];
};

export const projects: Project[] = [
  {
    slug: "willow-lily",
    number: "01",
    name: "Willow Lily",
    category: "Hospitality / Weddings / Custom Experience",
    description: "A digital-first tour of a luxury inn and wedding estate, designed to help couples understand the property, picture the weekend and move toward inquiry with confidence.",
    url: "https://willowlilyestate.com",
    tone: "willow",
    details: ["Venue Strategy", "Custom Development", "Interactive Systems"],
    desktopAsset: "/projects/willow-lily/desktop/willow-entry-screen.PNG",
    mobileAsset: "/projects/willow-lily/desktop/willow-contact-form.PNG",
    brief: "Create a premium hospitality experience that feels like the beginning of the venue tour, not a brochure. The site needed to explain the estate, weekend stay, ceremony possibilities, investment and planning details without making the visitor hunt for answers.",
    challenge: "Luxury venue websites often ask couples to fall in love with a property while giving them fragmented information about the actual experience. The concept needed to preserve romance without sacrificing clarity.",
    strategy: "Treat the website as a guided venue tour. Lead with atmosphere, then progressively answer the practical questions that determine whether a couple feels ready to inquire.",
    approach: ["Digital first-tour structure", "Interactive estate map", "Weekend and wedding planning flows", "Clear investment and inquiry paths"],
    outcome: "A conversion-focused demonstration of how a luxury venue can connect storytelling, planning information and custom interaction in one cohesive guest journey. No performance metrics are claimed because Willow Lily is an original studio concept.",
    evidence: ["/projects/willow-lily/desktop/willow-entry-screen.PNG", "/projects/willow-lily/desktop/willow-estate-map.PNG", "/projects/willow-lily/desktop/willow-contact-form.PNG"],
  },
  {
    slug: "maison-riviere",
    number: "02",
    name: "Maison Rivière",
    category: "Hospitality / Events / Digital Presence",
    description: "An editorial hospitality concept designed to make the venue feel considered before a guest ever walks through the door, while keeping tours and inquiry easy to reach.",
    url: "https://www.maisonrivieredetroit.com",
    tone: "maison",
    details: ["Experience Design", "Development", "Hospitality UX"],
    desktopAsset: "/projects/maison-riviere/desktop/maison-homepage-hero.PNG",
    mobileAsset: "/projects/maison-riviere/desktop/maison-tour-inquiry.PNG",
    brief: "Translate an event and hospitality brand into a digital presence that feels editorial, distinctive and useful. The experience needed to support real customer decisions without losing the mood of the venue.",
    challenge: "A visually strong venue can lose impact online when atmosphere and information live in separate worlds. The concept needed to hold onto the brand while making exploration and action straightforward.",
    strategy: "Use editorial pacing to build desire, then anchor each stage with a clear decision path so the visitor never has to choose between inspiration and information.",
    approach: ["Editorial presentation", "Hospitality-first navigation", "Responsive custom development", "Tour and inquiry pathways"],
    outcome: "A studio demonstration showing how a hospitality brand can feel expressive without making the customer work to understand what to do next. No measured business results are claimed because Maison Rivière is a concept project.",
    evidence: ["/projects/maison-riviere/desktop/maison-homepage-hero.PNG", "/projects/maison-riviere/desktop/maison-wedding-builder.PNG", "/projects/maison-riviere/desktop/maison-tour-inquiry.PNG"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
