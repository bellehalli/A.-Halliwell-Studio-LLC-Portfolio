export type ProjectStrategy = {
  measures: { title: string; observe: string }[];
  artifact: { title: string; purpose: string; steps: { title: string; decision: string; handoff: string }[] };
};
/** Strategy maps derived from the concept flows, not client research or measured results. */
export const projectStrategy: Record<string, ProjectStrategy> = {
  "willow-lily": {
    measures: [
      { title: "Qualified tour inquiries", observe: "Review completed inquiries for celebration details, timing, and fit with the estate offering." },
      { title: "Inquiry completion", observe: "Compare inquiry starts with completed submissions and review where couples leave the form." },
      { title: "Planning engagement", observe: "Observe date exploration, wedding-builder use, and estate-map interactions before inquiry." },
      { title: "Better prepared tours", observe: "Ask the venue team which basic questions still need answering before a visit." },
    ],
    artifact: { title: "The estate-to-tour conversion flow", purpose: "Give couples the information they need at each decision, then carry their preferences into the tour conversation.", steps: [
      { title: "Discover", decision: "Does this place feel like us?", handoff: "Estate introduction and location guide" },
      { title: "Picture the weekend", decision: "How would our celebration and stay fit together?", handoff: "Weddings, Weekend, and Inn pathways" },
      { title: "Explore the fit", decision: "Do the dates and investment suit our plans?", handoff: "Investment, date exploration, and wedding builder" },
      { title: "Request a tour", decision: "What do we need to share before visiting?", handoff: "A contextual inquiry with celebration preferences" },
    ] },
  },
  "maison-riviere": {
    measures: [
      { title: "Private-tour inquiries", observe: "Review inquiry volume and the completeness of guest-count, date, and celebration details." },
      { title: "Investment exploration", observe: "Observe visits to Investment and wedding-builder interactions before a tour request." },
      { title: "Tour-form completion", observe: "Compare form starts with completions, including differences between mobile and desktop." },
      { title: "Clearer first conversations", observe: "Ask the team whether inquiries show an understanding of the venue, capacity, and offering." },
    ],
    artifact: { title: "The private-tour decision map", purpose: "Connect venue atmosphere to practical fit, with a visible next step throughout exploration.", steps: [
      { title: "Make an impression", decision: "Can we imagine our wedding here?", handoff: "Waterfront introduction and venue story" },
      { title: "Understand the estate", decision: "Which spaces suit our guests?", handoff: "Estate, experience, and gallery content" },
      { title: "Shape the celebration", decision: "What would our choices mean for investment?", handoff: "Investment guidance and illustrative wedding builder" },
      { title: "Arrange a visit", decision: "Are we ready to speak to the venue?", handoff: "Private-tour inquiry" },
    ] },
  },
  "vanta-social": {
    measures: [
      { title: "Event discovery", observe: "Observe event-calendar exploration and next-step clicks from individual event details." },
      { title: "VIP interest", observe: "Review VIP section exploration and reservation or inquiry starts, then completions." },
      { title: "Insider-list engagement", observe: "Compare list sign-up starts with completed, consented subscriptions in a commissioned build." },
      { title: "Less arrival friction", observe: "Ask the venue team whether guests can find entry, timing, and location information without a direct message." },
    ],
    artifact: { title: "From tonight’s plans to group intent", purpose: "Keep practical event information and VIP comparison close to the moment a guest decides to go out.", steps: [
      { title: "Find the night", decision: "What is happening and when?", handoff: "Tonight’s events and calendar" },
      { title: "Plan arrival", decision: "What do we need to know before leaving?", handoff: "Entry, location, and event details" },
      { title: "Compare VIP", decision: "Which section fits the group?", handoff: "Section discovery and party-size context" },
      { title: "Take the next step", decision: "Do we join the list or request a section?", handoff: "Insider access or VIP inquiry" },
    ] },
  },
  "elan-aesthetics": {
    measures: [
      { title: "Treatment-finder use", observe: "Observe finder starts, completed paths, and which treatment details visitors explore afterward." },
      { title: "Consultation completion", observe: "Compare consultation starts with completions across the treatment pathways." },
      { title: "Membership interest", observe: "Review membership-detail engagement and related consultation inquiries." },
      { title: "More informed inquiries", observe: "Ask the clinic whether visitors understand consultation expectations before making contact." },
    ],
    artifact: { title: "The guided consultation pathway", purpose: "Help visitors explore relevant information without presenting a website tool as a clinical diagnosis.", steps: [
      { title: "Explore a concern", decision: "Where should I begin?", handoff: "Treatment finder and concern-led navigation" },
      { title: "Understand the options", decision: "What does this treatment involve?", handoff: "Treatment education and expectations" },
      { title: "Consider ongoing care", decision: "Would a membership suit my goals?", handoff: "Membership information" },
      { title: "Start a consultation", decision: "What should a qualified provider help me decide?", handoff: "Consultation inquiry" },
    ] },
  },
  "northstar-heating-home": {
    measures: [
      { title: "Service requests", observe: "Review request starts, completed submissions, and whether the chosen service matches the stated need." },
      { title: "Urgent-service calls", observe: "Observe urgent-call link clicks; use call records to verify actual calls rather than equating clicks with booked service." },
      { title: "Estimate requests", observe: "Review replacement-estimate starts and completions, including context gathered before contact." },
      { title: "Maintenance interest", observe: "Observe maintenance-page use and inquiries about ongoing care." },
      { title: "Decision-guide engagement", observe: "Observe repair-or-replace guide completion and the next service path visitors choose." },
    ],
    artifact: { title: "Problem-first service routing", purpose: "Let a homeowner find the right next step without having to diagnose their own HVAC system.", steps: [
      { title: "Describe the need", decision: "Is it urgent, routine, or a replacement question?", handoff: "Problem-first navigation" },
      { title: "Get immediate help", decision: "Do I need to call or request service?", handoff: "Urgent contact and service-request pathways" },
      { title: "Consider replacement", decision: "What should I ask about repair versus replacement?", handoff: "General decision guide and estimate request" },
      { title: "Plan ongoing care", decision: "How can I keep the system maintained?", handoff: "Maintenance information and inquiry" },
    ] },
  },
};
