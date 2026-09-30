import "./consultation.css";

export default function ConsultationLink() {
  return <section className="consultation-invitation" aria-label="Book a phone consultation">
    <div><small>LET’S TALK ABOUT YOUR PROJECT</small><h2>A conversation is a lovely place to start.</h2><p>A 15-minute phone call to talk through your goals, your project, and the next steps. Choose an available time, leave your phone number, and Arabella will call you.</p></div>
    <a className="button button-primary" href="https://calendar.app.google/UArjShmAHzt4vGE48" target="_blank" rel="noopener noreferrer" data-consultation-booking>Book a consultation<span className="consultation-new-tab">Opens Google Calendar in a new tab</span></a>
  </section>;
}
