import type { Metadata } from "next";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Beauty Website Template for Salon Professionals",
  description: "A polished, mobile-ready beauty website template for independent hair, nail, lash, and skincare professionals. Buy the DIY template or have A. Halliwell Studio implement it for you.",
  alternates: { canonical: "/beauty-booking-template" },
  openGraph: {
    title: "Beauty, Booked. — A. Halliwell Studio",
    description: "A beauty website designed to turn your best work into easier bookings.",
    url: "/beauty-booking-template",
    type: "website",
  },
};

const email = "hello@ahalliwellstudio.com";
const orderLink = (offer: string, price: string) => `mailto:${email}?subject=${encodeURIComponent(`Beauty, Booked. — ${offer}`)}&body=${encodeURIComponent(`Hello A. Halliwell Studio,\n\nI’d like to purchase the ${offer} for ${price}.\n\nMy name and business name are:\nMy website or Instagram is:\n\nPlease send me the secure payment instructions and next steps.\n`)}`;

const pages = ["Home", "About", "Services", "Gallery", "Policies", "Book" ];
const services = [
  { name: "Silk press", detail: "A smooth, polished finish", price: "From $85" },
  { name: "Knotless braids", detail: "A protective style, made personal", price: "From $180" },
  { name: "Custom facial", detail: "A restorative studio treatment", price: "From $120" },
];

function PreviewSite() {
  return <div className={styles.previewShell} aria-label="Preview of the beauty website template">
    <div className={styles.browserBar} aria-hidden="true"><i/><i/><i/><span>yourbeautystudio.com</span><b>↗</b></div>
    <div className={styles.demoSite}>
      <header className={styles.demoNav}><a href="#template-preview" className={styles.demoWordmark}>MUSE <small>BEAUTY STUDIO</small></a><nav aria-label="Sample template navigation">{pages.slice(1, 5).map(page => <a href={page === "About" ? "#demo-about" : page === "Services" ? "#demo-services" : "#demo-book"} key={page}>{page}</a>)}</nav><a className={styles.demoBook} href="#demo-book">BOOK</a></header>
      <section className={styles.demoHero}>
        <Image src="/assets/templates/beauty-studio-editorial.webp" alt="A stylist caring for a client's natural curls in a warm, modern beauty studio" fill priority sizes="(max-width: 800px) 100vw, 760px" className={styles.demoPhoto}/>
        <div className={styles.demoOverlay}/>
        <div className={styles.demoHeroText}><span>BEAUTY WITH INTENTION</span><h2>Care that feels<br/><em>like you.</em></h2><p>Thoughtful beauty services, a studio that feels like yours, and an easy way to book your next visit.</p><a href="#demo-book">BOOK YOUR APPOINTMENT <b aria-hidden="true">↗</b></a></div>
        <span className={styles.demoIssue}>MUSE / 001</span>
      </section>
      <section className={styles.demoIntro} id="demo-about"><span>01 / THE STUDIO</span><h3>Your beauty.<br/><em>Your kind of care.</em></h3><p>A space to feel seen, cared for, and beautiful in the way that feels most like you.</p></section>
      <section className={styles.demoServices} id="demo-services"><div className={styles.demoServicesTop}><span>02 / THE MENU</span><a href="#demo-book">VIEW ALL SERVICES ↗</a></div><div className={styles.serviceRows}>{services.map((service, i) => <article key={service.name}><b>0{i+1}</b><div><h4>{service.name}</h4><p>{service.detail}</p></div><strong>{service.price}</strong><a href="#demo-book" aria-label={`Book ${service.name}`}>↗</a></article>)}</div></section>
      <footer className={styles.demoFooter} id="demo-book"><span>YOUR NEXT VISIT STARTS HERE.</span><a href="#demo-book">FIND YOUR APPOINTMENT ↗</a></footer>
    </div>
  </div>;
}

export default function BeautyBookingTemplatePage() {
  return <main className={styles.page}>
    <Navigation/>
    <div className={styles.shell}>
      <section className={styles.hero} aria-labelledby="beauty-heading">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span className={styles.star}>✦</span> A. HALLIWELL STUDIO / BEAUTY DIGITAL</p>
          <p className={styles.overline}>FOR THE ARTISTS BEHIND THE APPOINTMENT</p>
          <h1 id="beauty-heading">Beauty,<br/><em>booked.</em></h1>
          <p className={styles.lede}>A distinctive website template for independent beauty pros ready to make booking feel as good as the service.</p>
          <div className={styles.heroActions}><a className={styles.primaryButton} href="#offers">EXPLORE THE TEMPLATE <span aria-hidden="true">↓</span></a><a className={styles.textLink} href="#template-preview">SEE THE PREVIEW ↗</a></div>
          <div className={styles.heroNote}><span className={styles.noteHeart}>♡</span><p><b>Designed by A. Halliwell Studio.</b><br/>A polished first impression, with a clear next step for your next client.</p></div>
        </div>
        <div className={styles.heroVisual} id="template-preview"><PreviewSite/><div className={styles.sticker}><span>MADE FOR<br/>THE BOOKED<br/>AND BECOMING</span><b>♥</b></div><p className={styles.caption}>A BEAUTY SITE THAT FEELS LIKE <em>your</em> brand.</p></div>
      </section>

      <section className={styles.details} aria-label="Template benefits"><div><span>01</span><h2>Built for beauty work.</h2><p>Service menu, gallery, policies, location, and booking path in one considered experience.</p></div><div><span>02</span><h2>Easy to make yours.</h2><p>Update your name, services, colors, photos, and booking link with the included guide.</p></div><div><span>03</span><h2>Made to move.</h2><p>Responsive layouts designed to feel intentional on a phone, where many clients find you.</p></div></section>

      <section className={styles.offerSection} id="offers" aria-labelledby="offers-heading">
        <div className={styles.offerHeading}><p className={styles.overline}>THE AHS BEAUTY EDIT / NO. 001</p><h2 id="offers-heading">Choose your<br/><em>launch style.</em></h2><p>Start with the complete template, or let AHS shape it around your business and get it ready to launch.</p></div>
        <div className={styles.offerCards}>
          <article className={styles.offerCard}>
            <div className={styles.offerTop}><span>01 / MAKE IT YOURS</span><span className={styles.offerMark}>✧</span></div>
            <h3>The DIY template</h3><p className={styles.price}>$149 <small>one-time</small></p>
            <p className={styles.offerDescription}>A complete HTML, CSS, and JavaScript website template with a guided setup kit.</p>
            <ul>{["Six coordinated page layouts", "Mobile-ready design", "Service menu + booking buttons", "Step-by-step setup guide", "Single-business use license"].map(item => <li key={item}><b aria-hidden="true">✓</b>{item}</li>)}</ul>
            <p className={styles.fitNote}>Best if you’re comfortable updating website files and arranging your own domain and hosting.</p>
            <a className={styles.secondaryButton} href={orderLink("DIY beauty website template", "$149")}>ORDER THE TEMPLATE <span aria-hidden="true">↗</span></a>
          </article>
          <article className={`${styles.offerCard} ${styles.featuredCard}`}>
            <div className={styles.offerTop}><span>02 / THE STUDIO SETUP</span><span className={styles.offerMark}>♡</span></div>
            <h3>Template + implementation</h3><p className={styles.price}>$1,250 <small>one-time</small></p>
            <p className={styles.offerDescription}>The same beauty template, personalized and launched by A. Halliwell Studio.</p>
            <ul>{["Your brand colors, logo + photos", "Your services + business details", "Booking link connected", "Up to one revision round", "Mobile launch check + handoff"].map(item => <li key={item}><b aria-hidden="true">✓</b>{item}</li>)}</ul>
            <p className={styles.fitNote}>You provide your brand assets, service details, and booking account. AHS handles the setup.</p>
            <a className={styles.primaryButton} href={orderLink("template plus implementation", "$1,250")}>CHOOSE AHS IMPLEMENTATION <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </section>

      <section className={styles.finePrint}><span>THE DETAILS, BEAUTIFULLY CLEAR</span><p>Both options are one-time purchases. Booking buttons connect to the scheduling service you already use; appointment software, domain registration, and hosting are separate costs. The DIY template is a coded HTML/CSS/JavaScript product, not a Squarespace, Wix, or Canva theme. Sample business, service names, and pricing shown in the preview are illustrative and are not transferred as client facts. After you choose an option, AHS will send secure payment instructions and the next steps.</p><a href={`mailto:${email}?subject=${encodeURIComponent("Question about the Beauty, Booked. template")}`}>Questions before you choose? Email the studio ↗</a></section>
    </div>
  </main>;
}
