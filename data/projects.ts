export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  url: string;
  context: string;
  problem: string;
  strategy: string[];
  experience: string[];
  system: string[];
  build: string[];
  verifiedResult: string;
  nextAction: string;
  desktopAsset: string;
  mobileAsset: string;
};

export const projects: Project[] = [
  {
    slug: "willow-lily",
    number: "01",
    name: "Willow Lily Estate",
    category: "Hospitality / Wedding Experience",
    description: "A digital-first luxury venue experience built around discovery, planning, and qualified inquiry.",
    url: "https://willowlilyestate.com",
    context: "Luxury venues need more than galleries. They need digital experiences that help guests understand the full offer.",
    problem: "Visitors need clarity around experience, packages, logistics, and next steps before inquiry.",
    strategy: ["Journey-based architecture", "Interactive planning tools", "Conversion-focused content"],
    experience: ["Digital tour flow", "Weekend planning journey", "Clear inquiry pathways"],
    system: ["Interactive map", "Planning builder", "Inquiry system"],
    build: ["Custom Next.js experience", "Responsive interface", "SEO foundation"],
    verifiedResult: "The live website is the verifiable artifact. No unsupported performance claims are presented.",
    nextAction: "Review the experience and begin a project conversation."
    ,desktopAsset: "/projects/willow-lily/desktop.webp"
    ,mobileAsset: "/projects/willow-lily/mobile.webp"
  },
  {
    slug: "maison-riviere",
    number: "02",
    name: "Maison Rivière",
    category: "Hospitality / Events",
    description: "An editorial hospitality experience designed around atmosphere and action.",
    url: "https://www.maisonrivieredetroit.com",
    context: "Hospitality brands need digital spaces that communicate feeling and function.",
    problem: "Traditional pages often separate inspiration from decision-making.",
    strategy: ["Editorial storytelling", "Clear navigation", "Responsive design"],
    experience: ["Atmospheric browsing", "Event discovery", "Inquiry flow"],
    system: ["Content architecture", "Reusable sections", "Conversion paths"],
    build: ["Custom development", "Responsive layouts", "Metadata"],
    verifiedResult: "The live website is the verifiable artifact.",
    nextAction: "Start a project for a custom digital experience."
    ,desktopAsset: "/projects/maison-riviere/desktop.webp"
    ,mobileAsset: "/projects/maison-riviere/mobile.webp"
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
