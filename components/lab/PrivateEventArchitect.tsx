"use client";
import { eventSteps } from "@/lib/lab-routing";
import RoutingEngine from "./RoutingEngine";
export default function PrivateEventArchitect({
  inHome = false,
}: {
  inHome?: boolean;
}) {
  return (
    <div className="lab-experiment">
      <header className="lab-experiment-head">
        <div>
          <small>06 / PRIVATE EVENT ARCHITECT</small>
          <h3>
            One event.
            <br />
            <em>A useful sales brief.</em>
          </h3>
        </div>
        <p>
          For hotels, restaurants, venues, cultural spaces and retreat
          properties.
        </p>
      </header>
      <RoutingEngine
        steps={eventSteps}
        name="Private Event Architect"
        projectType="Hospitality / venue"
        needs={[
          "Quote or lead flow",
          "Custom interactive feature",
          "Booking or scheduling",
        ]}
        disclosure="Preferences for a sales conversation. Your venue team confirms capacity, accessibility, availability, production and lodging. No reservation or quote is made."
        inHome={inHome}
      />
    </div>
  );
}
