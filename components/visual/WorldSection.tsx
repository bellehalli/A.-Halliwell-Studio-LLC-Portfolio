import React from "react";

type WorldSectionProps = {
  background: string;
  label?: string;
  assets?: string[];
  children: React.ReactNode;
  className?: string;
};

export default function WorldSection({
  background,
  label,
  assets = [],
  children,
  className = "",
}: WorldSectionProps) {
  return (
    <section
      className={`world-section ${className}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      {assets.map((asset, index) => (
        <img
          key={`${asset}-${index}`}
          src={asset}
          alt=""
          aria-hidden="true"
          className={`world-section__asset world-section__asset--${index + 1}`}
        />
      ))}

      <div className="world-section__card">
        {label && <p className="world-section__label">{label}</p>}
        {children}
      </div>
    </section>
  );
}
