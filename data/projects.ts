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
  approach: string[];
};

export const projects: Project[] = [
  {
    slug: "willow-lily",
    number: "01",
    name: "Willow Lily",
    category: "Hospitality / Weddings / Custom Experience",
    description: "A conversion-focused digital experience for a luxury inn and wedding venue, designed to turn browsing into confident inquiry.",
    url: "https://willowlilyestate.com",
    tone: "willow",
    details: ["UX Strategy", "Custom Development", "Interactive Systems"],
    desktopAsset: "/projects/willow-lily/desktop.webp",
    mobileAsset: "/projects/willow-lily/mobile.webp",
    brief: "Create a polished hospitality experience that helps prospective wedding clients understand the property, explore the offer and move toward inquiry without flattening the brand into a generic venue template.",
    approach: ["Clearer guest journey", "Custom interactive moments", "Conversion-minded structure", "Responsive experience"],
  },
  {
    slug: "maison-riviere",
    number: "02",
    name: "Maison Rivière",
    category: "Hospitality / Events / Digital Presence",
    description: "An elevated hospitality website built to make the experience feel considered before a guest ever walks through the door.",
    url: "https://www.maisonrivieredetroit.com",
    tone: "maison",
    details: ["Web Design", "Development", "Hospitality UX"],
    desktopAsset: "/projects/maison-riviere/desktop.webp",
    mobileAsset: "/projects/maison-riviere/mobile.webp",
    brief: "Translate an event and hospitality brand into a digital presence that feels intentional, easy to explore and ready to support real customer decisions.",
    approach: ["Editorial presentation", "Hospitality-first UX", "Responsive development", "Clear action paths"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
