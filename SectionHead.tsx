export default function SectionHead({ label, title, children, onGreen = false }: { label?: string; title: string; children?: React.ReactNode; onGreen?: boolean }) {
  return (
    <header className="shead">
      {label && <p className={`label shead__label${onGreen ? " shead__label--green" : ""}`}>{label}</p>}
      <h2>{title}</h2>
      {children && <div className="reading shead__text">{children}</div>}
    </header>
  );
}
