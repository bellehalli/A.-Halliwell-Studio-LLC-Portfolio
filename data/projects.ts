export type Project = {
  number: string;
  name: string;
  category: string;
  description: string;
  url: string;
  tone: "willow" | "maison";
  details: string[];
  desktopAsset: string;
  mobileAsset: string;
};

export const projects: Project[] = [
  {
    number: "01",
    name: "Willow Lily",
    category: "Hospitality / Weddings / Custom Experience",
    description: "A conversion-focused digital experience for a luxury inn and wedding venue, designed to turn browsing into confident inquiry.",
    url: "https://willowlilyestate.com",
    tone: "willow",
    details: ["UX Strategy", "Custom Development", "Interactive Systems"],
    desktopAsset: "/projects/willow-lily/desktop.webp",
    mobileAsset: "/projects/willow-lily/mobile.webp",
  },
  {
    number: "02",
    name: "Maison Rivière",
    category: "Hospitality / Events / Digital Presence",
    description: "An elevated hospitality website built to make the experience feel considered before a guest ever walks through the door.",
    url: "https://www.maisonrivieredetroit.com",
    tone: "maison",
    details: ["Web Design", "Development", "Hospitality UX"],
    desktopAsset: "/projects/maison-riviere/desktop.webp",
    mobileAsset: "/projects/maison-riviere/mobile.webp",
  },
];
