import Image from "next/image";

const objects = {
  hero: [["story-computer", "/assets/objects/Portfolio Assets A.Halliwell  - 28.PNG"], ["story-message", "/assets/ui/Portfolio Assets A.Halliwell  - 13.PNG"], ["story-phone", "/assets/objects/Portfolio Assets A.Halliwell  - 29.PNG"], ["story-heart", "/assets/hearts/Portfolio Assets A.Halliwell  - 1.PNG"], ["story-star", "/assets/icon/stars/Portfolio Assets A.Halliwell  - 17.PNG"]],
  work: [["story-paperclip", "/assets/objects/Portfolio Assets A.Halliwell  - 9.PNG"], ["story-cursor", "/assets/ui/Portfolio Assets A.Halliwell  - 24.PNG"]],
  services: [["story-butterflies", "/assets/decorations/butterflies/Portfolio Assets A.Halliwell  - 19.PNG"]],
  lab: [["story-window", "/assets/ui/Portfolio Assets A.Halliwell  - 16.PNG"], ["story-pixel-heart", "/assets/hearts/Portfolio Assets A.Halliwell  - 43.PNG"]],
  studio: [["story-globe", "/assets/objects/Portfolio Assets A.Halliwell  - 51.PNG"]],
  start: [["story-start-spark", "/assets/icon/stars/Portfolio Assets A.Halliwell  - 49.PNG"]],
} as const;

export default function VisualUniverse({ zone }: { zone: keyof typeof objects }) {
  return <div className="visual-universe" aria-hidden="true">{objects[zone].map(([className, src]) => <Image className={`story-object ${className}`} src={src} alt="" width={300} height={300} sizes="220px" key={src}/>)}</div>;
}
