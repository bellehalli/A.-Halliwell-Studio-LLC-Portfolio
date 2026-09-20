type Props = { eyebrow: string; title: string; lede?: string };
export default function SectionHeader({ eyebrow, title, lede }: Props) {
  return <header className="section-header"><small>{eyebrow}</small><h2>{title}</h2>{lede ? <p>{lede}</p> : null}</header>;
}
