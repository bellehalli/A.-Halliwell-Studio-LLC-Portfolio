import type { CaseStudyScope } from "@/data/caseStudies";

const groups = [
  ["Strategy", "The thinking", "strategy"],
  ["Experience Design", "The journey", "experience"],
  ["Development", "The working system", "development"],
] as const;

export default function ScopeBreakdown({ scope }: { scope: CaseStudyScope }) {
  return <div className="case-world-scope">
    {groups.map(([title, note, key], index) => <div className="case-world-scope-row" key={key}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div><small>{note}</small><h3>{title}</h3></div>
      <ul>{scope[key].map(item => <li key={item}>{item}</li>)}</ul>
    </div>)}
  </div>;
}
