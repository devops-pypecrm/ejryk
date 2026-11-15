// A hairline with a single lightning jag that "strikes" across when it scrolls into view.
export default function BoltLine({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`nx-bolt-line${dark ? " is-dark" : ""}`} data-reveal aria-hidden="true">
      <div className="nx-bolt-draw">
      <svg viewBox="0 0 1200 44" preserveAspectRatio="none" focusable="false">
        <path d="M0 22 H520 L546 4 L566 38 L594 8 L616 22 H1200" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      </div>
    </div>
  );
}
