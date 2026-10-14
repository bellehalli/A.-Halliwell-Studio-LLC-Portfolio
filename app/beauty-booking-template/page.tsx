import type { Metadata } from "next";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import TemplateCheckoutButton from "./TemplateCheckoutButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Website Templates for Beauty, Events and Home Services | AHS",
  description: "Shop polished, mobile-ready website templates for hair, nails, lashes, skincare, aesthetics, nightlife, and home services. DIY or choose AHS implementation.",
  alternates: { canonical: "/beauty-booking-template" },
  openGraph: {
    title: "AHS Studio Templates — A. Halliwell Studio",
    description: "Distinctive website templates for independent service businesses and creative brands.",
    url: "/beauty-booking-template",
    type: "website",
    images: [{ url: "/assets/templates/beauty-studio-editorial.webp", width: 1672, height: 941, alt: "A. Halliwell Studio website template collection preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AHS Studio Templates — A. Halliwell Studio",
    description: "Website templates for beauty, nightlife, and home service businesses.",
    images: ["/assets/templates/beauty-studio-editorial.webp"],
  },
};

const email = "hello@ahalliwellstudio.com";
const orderLink = (offer: string, price: string) => `mailto:${email}?subject=${encodeURIComponent(`AHS Studio Templates — ${offer}`)}&body=${encodeURIComponent(`Hello A. Halliwell Studio,\n\nI’d like to purchase the ${offer} for ${price}.\n\nMy name and business name are:\nMy website or Instagram is:\n\nPlease send me the secure payment instructions and next steps.\n`)}`;

const pages = ["Home", "About", "Services", "Gallery", "Policies", "Book" ];
const services = [
  { name: "Silk press", detail: "A smooth finish with a care-first approach", price: "From $85" },
  { name: "Knotless braids", detail: "A lightweight protective style, tailored to you", price: "From $180" },
  { name: "Loc retwist", detail: "A clean retwist and style refresh", price: "From $95" },
];

const templates = [
  { name: "Beauty, Booked.", niche: "HAIR STUDIO", image: "beauty-studio-editorial.webp", alt: "A stylist caring for a client's natural curls", description: "A polished home for textured hair care, protective styling, and independent hair artists.", slug: "beauty-booking-template", price: "$149", implementation: "$1,250" },
  { name: "Rooted Rituals", niche: "BRAIDS + PROTECTIVE STYLES", image: "beauty-studio-editorial.webp", alt: "A hair stylist working in a welcoming studio", description: "Made for braid artists, locticians, and protective style specialists.", slug: "protective-style-template", price: "$149", implementation: "$1,250" },
  { name: "Nail Theory", niche: "NAIL ARTIST", image: "template-nails.webp", alt: "Burgundy and rose chrome nail art", description: "Showcase custom sets, service details, prep notes, and your booking path.", slug: "nail-artist-template", price: "$149", implementation: "$1,250" },
  { name: "Set & Stare", niche: "LASH + BROW ARTIST", image: "template-lashes.webp", alt: "A lash artist working in a warm private studio", description: "A clear, elegant online home for lash and brow artists.", slug: "lash-brow-template", price: "$149", implementation: "$1,250" },
  { name: "Stillwater Skin", niche: "SKINCARE STUDIO", image: "template-skin.webp", alt: "A skincare provider caring for a client", description: "A calm and considered service menu for estheticians and skincare studios.", slug: "skin-studio-template", price: "$149", implementation: "$1,250" },
  { name: "Élan Aesthetics", niche: "AESTHETICS + WELLNESS", image: "template-elan.webp", alt: "A calm, elegant aesthetics studio", description: "Consultation-first service discovery for independent aesthetics practices.", slug: "elan-aesthetics-template", price: "$399", implementation: "From $5,000" },
  { name: "Vanta Social", niche: "NIGHTLIFE + EVENTS", image: "template-vanta.webp", alt: "A dramatic venue ready for an evening event", description: "Events, guest-list details, VIP inquiries, and the practical details guests need.", slug: "vanta-social-template", price: "$999", implementation: "From $5,000" },
  { name: "Northstar Heating & Home", niche: "HOME SERVICES", image: "template-northstar.webp", alt: "A heating and cooling professional working at a home", description: "The complete 12-page HVAC website template, with all 10 original project photos and setup documentation.", slug: "northstar-home-service-template", price: "$999", implementation: "From $5,000" },
];

function PreviewSite() {
  return <div className={styles.previewShell} aria-label="Preview of the Beauty, Booked hair website template">
    <div className={styles.browserBar} aria-hidden="true"><i/><i/><i/><span>yourhairstudio.com</span><b></b></div>
    <div className={styles.demoSite}>
      <header className={styles.demoNav}><a href="#template-preview" className={styles.demoWordmark}>MUSE <small>HAIR STUDIO</small></a><nav aria-label="Sample template navigation">{pages.slice(1, 5).map(page => <a href={page === "About" ? "#demo-about" : page === "Services" ? "#demo-services" : "#demo-book"} key={page}>{page}</a>)}</nav><a className={styles.demoBook} href="#demo-book">BOOK</a></header>
      <section className={styles.demoHero}>
        <Image src="/assets/templates/beauty-studio-editorial.webp" alt="A stylist caring for a client's natural curls in a warm, modern beauty studio" fill priority sizes="(max-width: 800px) 100vw, 760px" className={styles.demoPhoto}/>
        <div className={styles.demoOverlay}/>
        <div className={styles.demoHeroText}><span>HAIR WITH INTENTION</span><h2>Care that feels<br/><em>like you.</em></h2><p>Thoughtful hair care, protective styling, and an easy way to book your next visit.</p><a href="#demo-book">BOOK YOUR APPOINTMENT</a></div>
        <span className={styles.demoIssue}>MUSE / 001</span>
      </section>
      <section className={styles.demoIntro} id="demo-about"><span>01 / THE STUDIO</span><h3>Your texture.<br/><em>Your kind of style.</em></h3><p>Hair care built around your texture, your routine, and the style that feels most like you.</p></section>
      <section className={styles.demoServices} id="demo-services"><div className={styles.demoServicesTop}><span>02 / THE MENU</span><a href="#demo-book">VIEW ALL SERVICES</a></div><div className={styles.serviceRows}>{services.map((service, i) => <article key={service.name}><b>0{i+1}</b><div><h4>{service.name}</h4><p>{service.detail}</p></div><strong>{service.price}</strong><a href="#demo-book" aria-label={`Book ${service.name}`}></a></article>)}</div></section>
      <footer className={styles.demoFooter} id="demo-book"><span>YOUR NEXT VISIT STARTS HERE.</span><a href="#demo-book">FIND YOUR APPOINTMENT</a></footer>
    </div>
  </div>;
}

export default function BeautyBookingTemplatePage() {
  return <main className={styles.page}>
    <Navigation/>
    <div className={styles.shell} id="main-content">
      <section className={styles.hero} aria-labelledby="beauty-heading">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span className={styles.star}>✦</span> A. HALLIWELL STUDIO / THE TEMPLATE EDIT</p>
          <p className={styles.overline}>EIGHT STARTING POINTS. ONE DISTINCTIVE STUDIO.</p>
          <h1 id="beauty-heading">Beauty,<br/><em>booked.</em></h1>
          <p className={styles.lede}>Eight distinctive website templates for beauty pros, nightlife brands, and home-service businesses ready to make a stronger first impression.</p>
          <div className={styles.heroActions}><a className={styles.primaryButton} href="#offers">EXPLORE THE COLLECTION</a><a className={styles.textLink} href="#template-preview">SEE THE PREVIEW</a></div>
          <div className={styles.heroNote}><span className={styles.noteHeart}>♡</span><p><b>Designed by A. Halliwell Studio.</b><br/>A polished first impression, with a clear next step for your next client.</p></div>
        </div>
        <div className={styles.heroVisual} id="template-preview"><PreviewSite/><div className={styles.sticker}><span>MADE FOR<br/>THE BOOKED<br/>AND BECOMING</span><b>♥</b></div><p className={styles.caption}>DESIGNED FOR YOUR INDUSTRY. MADE TO FEEL LIKE <em>your</em> brand.</p></div>
      </section>

      <section className={styles.details} aria-label="Template benefits"><div><span>01</span><h2>Built for beauty work.</h2><p>Service menu, gallery, policies, location, and booking, event, and inquiry paths in one considered experience.</p></div><div><span>02</span><h2>Easy to make yours.</h2><p>Update your name, services, colors, photos, and booking link with the included guide.</p></div><div><span>03</span><h2>Made to move.</h2><p>Responsive layouts designed to feel intentional on a phone, where many clients find you.</p></div></section>

      <section className={styles.collection} aria-labelledby="collection-heading">
        <span id="templates" aria-hidden="true" />
        <div className={styles.collectionHeading}><p className={styles.overline}>FIVE FOCUSED TEMPLATES / THREE ADVANCED CONCEPTS</p><h2 id="collection-heading">Find your<br/><em>starting point.</em></h2><p>Five focused service templates are $149 DIY or $1,250 with implementation. Élan and Vanta are $999 DIY advanced concepts. Northstar includes the complete 12-page website and all 10 project photos for $399 DIY; implementation starts at $5,000.</p></div>
        <div className={styles.collectionGrid}>
          {templates.map((template, i) => <article className={styles.templateCard} key={template.slug}>
            <a className={styles.templateImage} href="#offers" aria-label={`View purchase options for ${template.name}`}><Image src={`/assets/templates/${template.image}`} alt={template.alt} fill sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 25vw"/><span>0{i + 1} / AHS TEMPLATE</span></a>
            <div className={styles.templateBody}><p>{template.niche}</p><h3>{template.name}</h3><span>{template.description}</span><div className={styles.templateActions}><TemplateCheckoutButton slug={template.slug} label={`BUY DIY ${template.price}`} className={styles.checkoutButton}/><a href={orderLink(`${template.name} template + implementation`, template.implementation)}>{template.implementation === "$1,250" ? "AHS setup " : "Implementation "}{template.implementation}</a></div></div>
          </article>)}
        </div>
      </section>

      <section className={styles.offerSection} id="offers" aria-labelledby="offers-heading">
        <div className={styles.offerHeading}><p className={styles.overline}>THE AHS TEMPLATE EDIT / NO. 001</p><h2 id="offers-heading">Choose your<br/><em>launch style.</em></h2><p>Choose any design in the collection. Start with the coded template, or let AHS personalize and launch it for your business.</p></div>
        <div className={styles.offerCards}>
          <article className={styles.offerCard}>
            <div className={styles.offerTop}><span>01 / MAKE IT YOURS</span><span className={styles.offerMark}>✧</span></div>
            <h3>The DIY template</h3><p className={styles.price}>$149–$999 <small>one-time</small></p>
            <p className={styles.offerDescription}>Five focused templates are $149 each. Élan and Vanta are $999 each. Northstar is $399 and includes all 12 pages, all 10 project photos, and complete setup guides.</p>
            <ul>{["Pages and assets vary by template; Northstar includes all 12 pages + 10 photos", "Mobile-ready design", "Editable business details", "Step-by-step setup guide", "Single-business use license"].map(item => <li key={item}><b aria-hidden="true">✓</b>{item}</li>)}</ul>
            <p className={styles.fitNote}>Best if you’re comfortable updating website files and arranging your own domain and hosting.</p>
            <a className={styles.secondaryButton} href="#templates">CHOOSE A TEMPLATE ABOVE <span aria-hidden="true"></span></a>
          </article>
          <article className={`${styles.offerCard} ${styles.featuredCard}`}>
            <div className={styles.offerTop}><span>02 / THE STUDIO SETUP</span><span className={styles.offerMark}>♡</span></div>
            <h3>Template + implementation</h3><p className={styles.price}>$1,250+ <small>one-time</small></p>
            <p className={styles.offerDescription}>Focused templates: $1,250. Élan, Vanta, and Northstar advanced implementations start at $5,000 and receive a project-specific scope.</p>
            <ul>{["Your brand colors, logo + photos", "Your content + business details", "Booking, event, or inquiry link connected", "Up to one revision round", "Mobile launch check + handoff"].map(item => <li key={item}><b aria-hidden="true">✓</b>{item}</li>)}</ul>
            <p className={styles.fitNote}>You provide your brand assets, service details, and booking account. AHS handles the setup.</p>
            <a className={styles.primaryButton} href={orderLink("template plus implementation", "$1,250 focused / $5,000+ advanced")}>CHOOSE AHS IMPLEMENTATION <span aria-hidden="true"></span></a>
          </article>
        </div>
      </section>

      <section className={styles.finePrint}><span>THE DETAILS, BEAUTIFULLY CLEAR</span><p>All prices are one-time. DIY prices are $149 for the five focused templates, $999 for Élan or Vanta, and $399 for Northstar (12 pages + 10 project photos). Implementation is $1,250 for focused templates and starts at $5,000 for the advanced concepts. Appointment, ticketing, inquiry software, domain registration, and hosting are separate costs. Northstar is a coded 12-page HTML/CSS/JavaScript website, not a Squarespace, Wix, or Canva theme. Its request form shows a local demo confirmation and does not send or store submissions until connected to a form service. The included photos are bundled as part of this website template and are not sold as standalone stock images. Sample business, service names, and pricing shown in the preview are illustrative and must be replaced before launch. Each purchase grants one business a license for one website; the source files may not be resold, shared, or used for another business, and AHS retains the original template intellectual property. Payment is processed by Stripe, with the matching ZIP available immediately after successful checkout. Read the <a href="/terms">template terms</a> before purchase.</p><a href={`mailto:${email}?subject=${encodeURIComponent("Question about the AHS Studio Template Edit")}`}>Questions before you choose? Email the studio</a></section>
    </div>
  </main>;
}
