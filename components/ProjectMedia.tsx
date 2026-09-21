import Image from "next/image";

type Props = { desktop: string; mobile: string; name: string };

export default function ProjectMedia({ desktop, mobile, name }: Props) {
  return (
    <div className="device-composition">
      <div className="tape tape-one" aria-hidden="true" />
      <div className="browser-card">
        <div className="browser-top" aria-hidden="true"><span/><span/><span/><div>{name}</div></div>
        <div className="asset-slot">
          <Image src={desktop} alt={`${name} desktop homepage`} fill sizes="(max-width: 820px) 90vw, 850px" />
        </div>
      </div>
      <div className="phone-card">
        <span className="phone-notch" aria-hidden="true" />
        <Image src={mobile} alt={`${name} mobile homepage`} fill sizes="(max-width: 820px) 28vw, 220px" />
      </div>
      <div className="tape tape-two" aria-hidden="true" />
    </div>
  );
}
