"use client";

import Image from "next/image";

type Zone = "hero" | "work" | "services" | "lab" | "studio" | "start";
type Asset = { src: string; c: string };

const file = (folder: string, n: number) =>
  `/assets/${folder}/Portfolio Assets A.Halliwell  - ${n}.PNG`;

const zones: Record<Zone, Asset[]> = {
  hero: [
    { src: file("hearts", 2), c: "a-heart-purple" },
    { src: file("hearts", 3), c: "a-heart-glass" },
    { src: file("animations", 5), c: "a-spark" },
    { src: file("animations", 7), c: "a-butterfly-blur" },
    { src: file("objects", 9), c: "a-phone" },
    { src: file("objects", 10), c: "a-bow" },
    { src: file("ui", 14), c: "a-message" },
    { src: file("ui", 16), c: "a-computer" },
    { src: file("animations", 18), c: "a-chrome-star" },
  ],
  work: [
    { src: file("animations", 19), c: "a-butterflies" },
    { src: file("animations", 20), c: "a-butterfly" },
    { src: file("animations", 22), c: "a-star-pearlescent" },
    { src: file("animations", 23), c: "a-star-glass" },
    { src: file("ui", 24), c: "a-cursor" },
    { src: file("objects", 28), c: "a-paperclip" },
    { src: file("objects", 29), c: "a-binder" },
    { src: file("objects", 32), c: "a-disco" },
  ],
  services: [
    { src: file("ui", 34), c: "a-window-faint" },
    { src: file("ui", 35), c: "a-frame-pink" },
    { src: file("hearts", 43), c: "a-pixel-heart" },
  ],
  lab: [
    { src: file("objects", 51), c: "a-chrome-drip" },
    { src: file("objects", 57), c: "a-globe" },
  ],
  studio: [
    { src: file("ui", 59), c: "a-princess-message" },
    { src: file("ui", 60), c: "a-icon-sheet-one" },
    { src: file("ui", 61), c: "a-icon-sheet-two" },
    { src: file("ui", 62), c: "a-browser-pink" },
    { src: file("objects", 63), c: "a-tape" },
    { src: file("objects", 64), c: "a-film-strip" },
    { src: file("animations", 66), c: "a-pearl-flower" },
  ],
  start: [
    { src: file("ui", 13), c: "a-yes" },
    { src: file("animations", 17), c: "a-tiny-spark" },
    { src: file("animations", 25), c: "a-pink-sparkle" },
    { src: file("animations", 27), c: "a-pink-star" },
  ],
};

export default function VisualUniverse({ zone }: { zone: Zone }) {
  return (
    <div className={`visual-universe visual-${zone}`} aria-hidden="true">
      {zones[zone].map(({ src, c }) => (
        <Image
          key={src}
          className={`raw-asset ${c}`}
          src={src}
          alt=""
          width={420}
          height={420}
          sizes="(max-width: 800px) 120px, 300px"
        />
      ))}
    </div>
  );
}
