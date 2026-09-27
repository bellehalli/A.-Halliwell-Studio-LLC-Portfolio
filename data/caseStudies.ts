export type CaseStudyScope = {
  title: string;
  includes: string[];
};

export type CaseStudy = {
  positioning: string;
  statement: string;
  heroImage: string;
  heroImageAlt: string;
  brief: string;
  problem: string;
  strategy: string;
  journey: { title: string; description: string }[];
  scope: CaseStudyScope[];
  screensIntro: string;
  liveIntro: string;
};

// The public case files describe the work and its business purpose. Internal
// component valuations are intentionally kept out of the website bundle.
export const caseStudies: Record<string, CaseStudy> = {
  "willow-lily": {
    positioning: "Luxury Hospitality Experience + Wedding Planning System",
    statement: "The first tour begins before anyone arrives.",
    heroImage: "/projects/willow-lily/estate-landscape-01%202.AVIF",
    heroImageAlt: "The landscape of the Willow Lily estate",
    brief: "Give a couple the feeling of a weekend at Willow Lily while answering the questions that determine whether they are ready to visit. The estate, ceremony settings, inn, investment and planning details needed to belong to one considered journey.",
    problem: "A beautiful venue can still lose a couple in the gap between inspiration and information. When the stay, spaces, dates and next step live in separate places, they have to assemble the experience for themselves.",
    strategy: "Treat the website like a hosted first tour: establish the place, let couples picture their celebration, explain the practical choices, then invite a tour request with context already gathered.",
    journey: [
      { title: "Discover the estate", description: "Meet the property and the atmosphere before asking for a decision." },
      { title: "Imagine the weekend", description: "Explore ceremonies, celebrations and the inn as one experience." },
      { title: "Understand the options", description: "Find planning, investment and date exploration in the same visit." },
      { title: "Request a tour", description: "Carry preferences into an inquiry instead of starting over." },
    ],
    scope: [
      { title: "Creative direction", includes: ["Luxury hospitality visual direction", "Editorial storytelling", "Guest journey creative direction"] },
      { title: "Strategy & architecture", includes: ["Customer journey mapping", "Estate, Weddings, Weekend and Inn", "Investment, Planning and Visit pathways"] },
      { title: "Custom website design", includes: ["Multi-page venue experience", "Editorial layouts", "Responsive design system"] },
      { title: "Wedding experience", includes: ["Wedding builder flow", "Guest and package exploration", "Experience planning interactions"] },
      { title: "Date exploration concept", includes: ["Availability states", "Alternative date paths", "Clear next steps for couples"] },
      { title: "Inquiry journey", includes: ["Tour request pathway", "Preference capture", "Lead handoff experience"] },
      { title: "Development", includes: ["Custom front-end", "Responsive implementation", "Interactive states"] },
    ],
    screensIntro: "A few moments from the build, from first impression to a more informed inquiry.",
    liveIntro: "Explore the working concept. The preview keeps the journey scrollable; the full site opens the complete experience.",
  },
};
