import { studioFaqs } from "@/data/faqs";
import "./studio-faq.css";

export default function StudioFaq() {
  return <section className="studio-faq" id="faqs" aria-labelledby="studio-faq-heading">
    <small>A FEW THINGS YOU MIGHT BE WONDERING</small>
    <h2 id="studio-faq-heading">Before we begin.</h2>
    <p className="studio-faq-intro">The practical details, so you can picture what working together looks like.</p>
    <div className="studio-faq-list">{studioFaqs.map(({ question, answer }) => <details key={question}>
      <summary>{question}<span aria-hidden="true" className="studio-faq-toggle" /></summary>
      <div className="studio-faq-answer">{answer.split("\n\n").map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </details>)}</div>
  </section>;
}
