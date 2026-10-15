import { pricingSummary, servicePaymentTerms, studio } from "@/lib/studio-config";

export const studioFaqs = [
  {
    "question": "What kinds of projects do you take on?",
    "answer": "I create custom websites, illustrations, and digital systems shaped around your business. That can include booking experiences, commerce, client portals, interactive features, and improvements to an existing website. Your proposal defines exactly what’s included."
  },
  {
    "question": "How much does a project cost?",
    "answer": `${pricingSummary} You’ll receive a proposal outlining the deliverables and investment before you commit.`
  },
  {
    "question": "What is included in the Small Business Site?",
    "answer": "Up to five pages with mobile-ready design, basic SEO setup, a simple inquiry form or an existing booking link, and two revision rounds. You supply copy, logo and photos. New booking systems, commerce and custom integrations are separate scopes."
  },
  {
    "question": "How do payments work?",
    "answer": servicePaymentTerms
  },
  {
    "question": "How long does a project take?",
    "answer": "Each project has its own timeline based on scope, complexity, and the readiness of your materials. We’ll agree on an estimated schedule before work begins and communicate adjustments through your project portal."
  },
  {
    "question": "How many revisions are included?",
    "answer": "One-Page Launch and Small Business Site include two rounds of revisions. Quick Fix covers one agreed issue and verification that the fix works. Larger engagements may include additional rounds, as specified in your proposal. Each round is one consolidated set of feedback on the presented work. New features or a change in direction may require additional scope."
  },
  {
    "question": "Do I need my copy, photos, and branding ready?",
    "answer": "Bring what you have. We’ll review your materials and identify what’s needed to move forward. Copywriting, photography, branding, and additional creative services are included when specified in your proposal."
  },
  {
    "question": "Who owns the finished work?",
    "answer": "You retain ownership of your domain and the brand assets and materials you supply. Your agreement explains the ownership or usage rights granted for the completed work after full payment.\n\nThe studio retains its reusable code, tools, frameworks, and underlying systems unless otherwise agreed. Illustration licenses and any ongoing system licensing requirements are clearly defined in your agreement."
  },
  {
    "question": "Are hosting and maintenance included?",
    "answer": `Your proposal identifies any hosting, domain, software, licensing, or maintenance costs associated with your project. These may be separate from the design and development investment. ${studio.offers.support} covers separately scoped updates, refinements, new features, and technical support, with clear responsibilities and pricing.`
  },
  {
    "question": "How do I get started?",
    "answer": "Submit a project inquiry or book a 15-minute phone consultation. We’ll discuss what you have in mind, what your business needs, and the next step."
  }
];
