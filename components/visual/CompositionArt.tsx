type Composition = "proof" | "offer" | "lab";

/** Individual artwork stays independent of the live text and controls. */
export default function CompositionArt({ scene }: { scene: Composition }) {
  const pieces: Record<Composition, string[]> = {
    proof: ["star", "butterfly-one", "butterfly-two", "flower-one", "flower-two", "clip"],
    offer: ["diamond-heart", "foil-card", "pearl-chain", "glint-one", "glint-two"],
    lab: ["disc", "folder", "laptop", "cursor", "chrome-star", "music-window"],
  };

  return <div className={`composition-art composition-${scene}`} aria-hidden="true">
    {pieces[scene].map(piece => <span className={`composition-piece piece-${piece}`} key={piece} />)}
  </div>;
}
