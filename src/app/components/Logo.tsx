import Link from "next/link";
import { SITE } from "../../data/site";

export function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M13.6 1.5 4.2 13.8h6.1l-1.9 8.7 9.9-12.6h-6.2z" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ bare = false }: { bare?: boolean }) {
  const inner = (
    <>
      <span className="nx-logo-mark"><BoltIcon /></span>
      <span className="nx-logo-text">{SITE.name}<small>tech solutions</small></span>
    </>
  );
  if (bare) return <span className="nx-logo">{inner}</span>;
  return <Link href="/" className="nx-logo" aria-label={SITE.legal}>{inner}</Link>;
}
