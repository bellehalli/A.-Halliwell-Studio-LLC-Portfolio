import Image from "next/image";

type Zone = "hero" | "work" | "services" | "lab" | "studio" | "start";
type Asset = { src: string; className: string };

const asset = (folder: string, n: number) =>
  `/assets/${folder}/Portfolio Assets A.Halliwell  - ${n}.PNG`;

const zones: Record<Zone, Asset[]> = {
  hero: [
    { src: asset("ui", 16), className: "story-computer" },
    { src: asset("ui", 14), className: "story-message" },
    { src: asset("objects", 9), className: "story-phone" },
    { src: asset("hearts", 3), className: "story-heart" },
    { src: asset("animations", 18), className: "story-star" },
  ],
  work: [
    { src: asset("objects", 28), className: "story-paperclip" },
    { src: asset("ui", 24), className: "story-cursor" },
    { src: asset("animations", 19), className: "story-butterflies" },
  ],
  services: [
    { src: asset("ui", 34), className: "story-window" },
    { src: asset("hearts", 43), className: "story-pixel-heart" },
  ],
  lab: [
    { src: asset("objects", 51), className: "story-chrome" },
    { src: asset("objects", 57), className: "story-globe" },
  ],
  studio: [
    { src: asset("ui", 62), className: "story-browser" },
    { src: asset("objects", 63), className: "story-tape" },
    { src: asset("objects", 64), className: "story-film" },
    { src: asset("animations", 66), className: "story-pearl" },
  ],
  start: [
    { src: asset("animations", 25), className: "story-start-spark" },
    { src: asset("animations", 27), className: "story-start-star" },
  ],
};

export default function VisualUniverse({ zone }: { zone: Zone }) {
  return (
    <div className={`visual-universe visual-${zone}`} aria-hidden="true">
      {zones[zone].map(({ src, className }) => (
        <Image
          key={`${zone}-${src}`}
          className={`story-object ${className}`}
          src={src}
          alt=""
          width={520}
          height={520}
          sizes="(max-width: 760px) 150px, 360px"
        />
      ))}
    </div>
  );
}
