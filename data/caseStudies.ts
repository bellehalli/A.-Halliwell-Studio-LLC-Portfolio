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
  screenChapters?: { title: string; description: string; screens: { file: string; caption: string }[] }[];
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
    screenChapters: [
      { title: "Enter the estate", description: "A deliberate opening gives way to the place itself, then lets a couple explore its ceremony settings.", screens: [
        { file: "willow-lily-desktop-entry-screen.jpg", caption: "The entry moment" },
        { file: "willow-lily-desktop-hero-entry-screen.jpg", caption: "The estate introduction" },
        { file: "willow-lily-desktop-digital-tour-map.jpg", caption: "The location guide" },
      ] },
      { title: "Make it theirs", description: "The wedding journey remembers choices, introduces date exploration and turns an imagined weekend into a specific plan.", screens: [
        { file: "willow-lily-mobile-homepage-hero.jpg", caption: "Choosing a wedding date" },
        { file: "willow-lily-desktop-availability-widget.jpg", caption: "A personalized wedding summary" },
        { file: "willow-lily-mobile-availability-widget.jpg", caption: "The saved experience and next steps" },
        { file: "willow-lily-desktop-wedding-builder-start.jpg", caption: "A tour request with the couple's context" },
      ] },
      { title: "Carry the decision forward", description: "A proposal, venue investment and test-mode deposit handoff show how the experience can support a booking conversation.", screens: [
        { file: "willow-lily-desktop-investment-page.jpg", caption: "The personalized proposal" },
        { file: "willow-lily-mobile-investment-page.jpg", caption: "The venue investment and decision path" },
        { file: "willow-lily-desktop-inn-page.jpg", caption: "A test-mode payment handoff" },
        { file: "willow-lily-desktop-planning-page.jpg", caption: "The Stripe test checkout" },
      ] },
      { title: "Behind the welcome", description: "The demonstration also shows a venue-facing workspace: tour leads, calendar activity, sales intelligence and an integration blueprint.", screens: [
        { file: "willow-lily-mobile-wedding-builder-start.jpg", caption: "The demonstration workspace" },
        { file: "willow-lily-mobile-wedding-builder-details.jpg", caption: "The venue calendar and lead pipeline" },
        { file: "willow-lily-mobile-wedding-builder-date.jpg", caption: "Illustrative sales intelligence" },
        { file: "willow-lily-desktop-wedding-builder-summary.jpg", caption: "The production integration blueprint" },
      ] },
    ],
    liveIntro: "Explore the working concept. The preview keeps the journey scrollable; the full site opens the complete experience.",
  },
};
