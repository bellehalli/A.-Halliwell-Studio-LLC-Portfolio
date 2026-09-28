export type CaseStudyScope = { strategy: string[]; experience: string[]; interactive: string[]; development: string[] };

export type CaseStudy = {
  positioning: string;
  statement: string;
  heroImage?: string;
  heroImageAlt: string;
  summary: string;
  brief: string;
  problem: string;
  strategy: string;
  journey: { title: string; description: string }[];
  scope: CaseStudyScope;
  screensIntro: string;
  screenChapters?: { title: string; description: string; screens: { file: string; caption: string }[] }[];
  screensDisclosure?: string;
  liveIntro: string;
  journeyHeading?: string;
  journeyIntro?: string;
};

// The public case files describe the work and its business purpose. Internal
// component valuations are intentionally kept out of the website bundle.
export const caseStudies: Record<string, CaseStudy> = {
  "willow-lily": {
    positioning: "Luxury Hospitality Experience + Wedding Planning System",
    statement: "The first tour begins before anyone arrives.",
    summary: "An eight-acre estate becomes a guided hospitality experience: discovery, ceremony possibilities, the inn, date exploration, planning and tour inquiry in one connected journey.",
    heroImage: "/case-studies/willow-lily/willow-lily-desktop-hero-entry-screen.jpg",
    heroImageAlt: "The Willow Lily website introducing the wedding estate",
    brief: "Give a couple the feeling of a weekend at Willow Lily while answering the questions that determine whether they are ready to visit. The estate, ceremony settings, inn, investment and planning details needed to belong to one considered journey.",
    problem: "A beautiful venue can still lose a couple in the gap between inspiration and information. When the stay, spaces, dates and next step live in separate places, they have to assemble the experience for themselves.",
    strategy: "Treat the website like a hosted first tour: establish the place, let couples picture their celebration, explain the practical choices, then invite a tour request with context already gathered.",
    journey: [
      { title: "Discover the estate", description: "Meet the property and the atmosphere before asking for a decision." },
      { title: "Imagine the weekend", description: "Explore ceremonies, celebrations and the inn as one experience." },
      { title: "Understand the options", description: "Find planning, investment and date exploration in the same visit." },
      { title: "Request a tour", description: "Carry preferences into an inquiry instead of starting over." },
    ],
    scope: {
      strategy: ["Luxury hospitality positioning and guest research", "Couple journey mapping and information architecture", "Estate, Weddings, Weekend, Inn, Investment, Planning and Visit pathways"],
      experience: ["Editorial venue storytelling and discovery", "A connected journey from estate to tour inquiry"],
      interactive: ["Estate map, wedding builder and date exploration", "Tour inquiry with preference capture"],
      development: ["Custom responsive multi-page front end", "Planning and availability states", "Test-mode payment handoff demonstration"],
    },
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
    liveIntro: "Begin with the website itself. Scroll through the experience here, then open the full build to try the interactions.",
  },
  "maison-riviere": {
    positioning: "Luxury Wedding Venue Brand Experience + Investment Conversion System",
    statement: "A grand entrance, with every next step in view.",
    summary: "A waterfront wedding venue story that turns romance into a practical path through the estate, investment, wedding builder and private-tour request.",
    heroImage: "/case-studies/maison-riviere/maison-riviere-desktop-homepage-hero.jpg",
    heroImageAlt: "Maison Rivière website homepage with waterfront wedding positioning and tour invitation",
    brief: "Make a Detroit waterfront venue feel as compelling online as it would in person, while giving couples a way to explore the estate, understand the investment and arrange a private tour.",
    problem: "An atmospheric photograph can inspire, but a couple planning a wedding still needs to see the spaces, understand what is included and decide whether the venue fits their celebration. Those answers need to sit within the same experience.",
    strategy: "Open with the romance of the place, then make the estate, planning choices and investment easy to explore. The wedding builder gives a couple a way to test their preferences before the tour inquiry turns that interest into a more useful conversation.",
    scope: {
      strategy: ["Luxury venue positioning and couple decision research", "Estate-to-investment information architecture", "Private-tour conversion path"],
      experience: ["Waterfront storytelling and curated venue discovery", "Investment and inquiry journey"],
      interactive: ["Guest-count and celebration planning builder", "Illustrative investment estimate"],
      development: ["Responsive multi-page front end", "Wedding builder states", "Tour inquiry interface"],
    },
    journey: [
      { title: "Arrive", description: "Meet the waterfront setting and the promise of the celebration." },
      { title: "Explore", description: "See the estate, ballroom and hospitality experience in context." },
      { title: "Shape the day", description: "Try guest count, season, spaces and services in the wedding builder." },
      { title: "Request a tour", description: "Bring the important details into the first conversation." },
    ],
    screensIntro: "From the opening impression to a more informed private-tour inquiry.",
    screenChapters: [
      { title: "The invitation", description: "The opening lets the venue make an impression, then introduces the estate and its spaces without losing the way to schedule a visit.", screens: [
        { file: "maison-riviere-desktop-homepage-hero.jpg", caption: "The waterfront wedding introduction" },
        { file: "maison-riviere-desktop-estate-experience.jpg", caption: "The estate and ballroom experience" },
        { file: "maison-riviere-desktop-entry-screen.jpg", caption: "The opening title moment" },
      ] },
      { title: "The decision", description: "A couple can shape a celebration, see an illustrative estimate and take those details into a private-tour request.", screens: [
        { file: "maison-riviere-desktop-wedding-builder-estimate.jpg", caption: "The wedding builder and illustrative estimate" },
        { file: "maison-riviere-desktop-tour-inquiry.jpg", caption: "The private-tour inquiry" },
      ] },
    ],
    screensDisclosure: "Maison Rivière is a fictional venue demonstration. The wedding estimate is illustrative, and the tour form does not submit to a real venue.",
    liveIntro: "Explore the live website in the frame, including its navigation and wedding builder. Open the complete build for a full-screen visit.",
  },
  "vanta-social": {
    positioning: "Nightlife Brand Experience + Revenue Conversion Platform",
    statement: "The night starts before the door.",
    summary: "A digital front door for a Detroit nightlife concept, connecting the event calendar, arrival details, insider access and VIP section discovery.",
    heroImage: "/case-studies/vanta-social/vanta-homepage.webp",
    heroImageAlt: "Vanta Social website with Detroit nightlife imagery and direct paths to tonight's events and VIP",
    brief: "Give a Detroit nightlife concept a home beyond the social feed. Guests need to discover the night, understand entry, join a list or compare a VIP section before they leave for the venue.",
    problem: "Flyers can sell a mood while leaving the practical details scattered between posts, promoters and direct messages. That friction matters most when someone is ready to make plans with a group.",
    strategy: "Treat the site like a digital front door: lead with the energy of the room, make events and arrival details easy to find, then let VIP guests compare placement and minimums before requesting a section.",
    scope: {
      strategy: ["Nightlife audience and group-planning decisions", "Event, guest-list and VIP information architecture", "Pathways from flyer discovery to qualified inquiry"],
      experience: ["Event discovery and detail views", "Insider signup and social return path"],
      interactive: ["VIP floor plan and section comparison", "Bottle-service exploration and reservation pathway"],
      development: ["Responsive multi-page front end", "Interactive section and event states", "Illustrative list and reservation forms"],
    },
    journeyHeading: "From the flyer to the floor.",
    journeyIntro: "A guest's path through the night",
    journey: [
      { title: "Find the night", description: "Scan featured events and choose the music and date that fit." },
      { title: "Know the details", description: "See entry, hours, age policy and arrival information before leaving." },
      { title: "Choose a path", description: "Move toward tickets, a guest list or a VIP table." },
      { title: "Plan the table", description: "Compare the floor plan and bottle service before a qualified request." },
    ],
    screensIntro: "Selected views that show the event, venue and VIP decisions working together.",
    screenChapters: [
      { title: "Find your night", description: "The opening sells the room, while a featured night and event lineup give guests a specific plan to act on.", screens: [
        { file: "vanta-homepage.webp", caption: "The Detroit nightlife entrance" },
        { file: "vanta-featured-night.webp", caption: "The featured night" },
        { file: "vanta-events.webp", caption: "Event discovery for the weekend" },
      ] },
      { title: "Picture the room", description: "Atmosphere and table service sit in the same story, so the premium experience feels tangible before a guest inquires.", screens: [
        { file: "vanta-atmosphere.webp", caption: "The room and its energy" },
        { file: "vanta-vip-story.webp", caption: "The VIP proposition" },
      ] },
      { title: "Choose a section", description: "The interactive floor plan compares placement, capacity and minimums. An insider path keeps event drops and guest-list releases within reach.", screens: [
        { file: "vanta-vip-map.webp", caption: "The VIP section selector" },
        { file: "vanta-insiders.webp", caption: "The insider signup path" },
      ] },
    ],
    screensDisclosure: "Vanta Social is a fictional nightlife demonstration. Events, section availability and pricing are illustrative; signup and reservation forms do not transmit to a real venue.",
    liveIntro: "Explore the live site in the frame. Move through events and VIP to try the table selector and reservation path, or open the complete build.",
  },
  "elan-aesthetics": {
    positioning: "Luxury Med Spa Website + Consultation Journey",
    statement: "A more considered way to begin.",
    summary: "An aesthetics experience that earns trust before asking for a booking, helping visitors understand treatments, meet the practice and choose a consultation path.",
    heroImage: "/case-studies/elan-aesthetics/elan-home.jpg",
    heroImageAlt: "Élan Aesthetics live website showing treatment discovery and consultation pathways",
    brief: "Bring the calm and care of a private aesthetics studio online. The experience needed to educate people about treatment options, establish trust and make a consultation feel like a thoughtful first step.",
    problem: "Treatment names alone do not answer a visitor's real question: what fits my concern and what happens next? Without context around providers, results and expectations, booking can feel like a leap.",
    strategy: "Begin with a client's goals, explain the care behind each option and offer a guided route toward consultation. Let editorial space and clear language support confidence without promising clinical outcomes.",
    scope: {
      strategy: ["Concern-led positioning and prospective-client research", "Treatments, results, memberships and booking architecture", "Trust and consultation decision mapping"],
      experience: ["Treatment education and trust-building pathways", "Provider, results and membership presentation"],
      interactive: ["Concern-led treatment finder", "Consultation-first booking journey"],
      development: ["Responsive multi-page front end", "Treatment and booking states", "Illustrative consultation and membership interfaces"],
    },
    journeyHeading: "From curiosity to consultation.",
    journeyIntro: "A prospective client's path through the experience",
    journey: [
      { title: "Find a starting point", description: "Begin with a concern or desired experience rather than a treatment acronym." },
      { title: "Understand the care", description: "Read about services, providers and what an appointment involves." },
      { title: "Build confidence", description: "Explore results, membership options and practical details without a rushed promise." },
      { title: "Request a consultation", description: "Move into a guided booking conversation with clearer expectations." },
    ],
    screensIntro: "A closer look at discovery, trust and the path into a consultation.",
    screenChapters: [
      { title: "Begin with the feeling", description: "The opening makes the practice feel personal while keeping treatment discovery and consultation in view.", screens: [
        { file: "elan-home.jpg", caption: "The studio introduction" },
      ] },
      { title: "Find a direction", description: "The finder lets visitors begin with a goal, then frames a possible treatment path without replacing a real consultation.", screens: [
        { file: "elan-treatment-finder.jpg", caption: "Concern-led treatment discovery" },
      ] },
      { title: "Start a conversation", description: "A guided consultation form asks about goals, timing and preferences so the first interaction has context.", screens: [
        { file: "elan-consultation.jpg", caption: "The illustrative consultation journey" },
      ] },
    ],
    screensDisclosure: "Élan Aesthetics is an original fictional wellness concept. Treatments and business details are illustrative; this portfolio is not medical advice or a live clinical booking service.",
    liveIntro: "Explore the working concept below. Follow treatment discovery and consultation paths, or open the complete build in a new tab.",
  },
  "northstar-heating-home": {
    positioning: "Service Business Website + Lead Generation System",
    statement: "Comfort begins with a clear next step.",
    summary: "A local-service system that helps homeowners distinguish urgent service from planned replacement, then find a call, estimate or maintenance path.",
    heroImage: "/case-studies/northstar-heating-home/northstar-home.webp",
    heroImageAlt: "Northstar Heating & Home website opening with a Michigan home and clear service and estimate paths",
    brief: "Make a local home-service concept useful in two very different moments: when a homeowner needs help now, and when they are researching maintenance or a new system. Each path needs a clear reason to trust the business and an obvious next action.",
    problem: "A homeowner with no heat should not have to know which service page to open. Someone considering replacement needs time to compare repair history, comfort and cost. A single generic contact button treats those decisions as though they are the same.",
    strategy: "Organize the website by homeowner intent. Lead urgent visitors toward the relevant service and call path; give planned projects a decision guide, replacement process and financing context; and present maintenance as a continuing relationship rather than a one-time sale.",
    scope: {
      strategy: ["Homeowner intent and service-positioning research", "Urgent versus planned journey architecture", "Local trust and service-content structure"],
      experience: ["Problem-first service routing", "Estimate, service and maintenance pathways"],
      interactive: ["Repair-or-replace decision guide", "Quote and service request flows"],
      development: ["Responsive multi-page front end", "Interactive decision states", "Illustrative inquiry and scheduling interfaces"],
    },
    journeyHeading: "From concern to a confident call.",
    journeyIntro: "A homeowner's path through the site",
    journey: [
      { title: "Name the problem", description: "Start with the symptom, not contractor terminology." },
      { title: "Find the right route", description: "Move to a service, urgent call or planned estimate with less guesswork." },
      { title: "Weigh the options", description: "Use the repair-or-replace guide and process detail to frame the decision." },
      { title: "Take the next step", description: "Request service, explore an estimate or consider ongoing care." },
    ],
    screensIntro: "Selected moments show how immediate service, considered decisions and ongoing care fit together.",
    screenChapters: [
      { title: "Start with the homeowner", description: "A local, familiar opening leads into problem-first routing and the full service map, so the visitor does not have to diagnose an HVAC system to find help.", screens: [
        { file: "northstar-home.webp", caption: "The Michigan home-service entrance" },
        { file: "northstar-service-routing.webp", caption: "Urgent needs and service discovery" },
      ] },
      { title: "Make replacement understandable", description: "The replacement journey gives an estimate path, a five-question decision guide and a plain-language view of the process and financing considerations.", screens: [
        { file: "northstar-replacement.webp", caption: "The replacement pathway" },
        { file: "northstar-decision-guide.webp", caption: "The repair-or-replace decision guide" },
        { file: "northstar-replacement-process.webp", caption: "The process and financing context" },
      ] },
      { title: "Keep the relationship", description: "The maintenance experience turns seasonal care into a clear membership proposition, with the service benefits and illustrative rate visible together.", screens: [
        { file: "northstar-maintenance.webp", caption: "The year-round maintenance experience" },
      ] },
    ],
    screensDisclosure: "Northstar is a fictional home-service demonstration. Phone number, ratings, membership rates and financing details are illustrative. The decision guide offers general information, not a diagnosis or quote.",
    liveIntro: "Explore the working site in the frame. Follow an urgent service route or open Replacement to try the decision guide, then visit the complete build for the full experience.",
  },
};
