type Scene = "proof" | "offer" | "studio" | "lab" | "start" | "services" | "studioPage" | "labPage" | "resources" | "footer";

const props: Record<Scene, string[]> = {
  proof: ["clip", "star", "butterfly"],
  offer: ["bow", "heart", "chromeDrip"],
  studio: ["flower", "chromeButterfly", "pearls"],
  lab: ["globe", "purpleStar", "pixelStar"],
  start: ["tape", "pinkButterfly", "shine"],
  services: ["bow", "star", "clip"],
  studioPage: ["flower", "flatButterfly", "pearls"],
  labPage: ["globe", "purpleStar", "cursor"],
  resources: ["binder", "pinkButterfly", "shine"],
  footer: ["disco", "heart", "purpleStar"],
};

/** Artwork is decorative. The scene has no focus targets or reading order. */
export default function SceneProps({ scene }: { scene: Scene }) {
  return <div className={`scene-props scene-${scene}`} aria-hidden="true">{props[scene].map((name, index) => <span key={`${name}-${index}`} className={`scene-prop prop-${name}`} />)}</div>;
}
