import Link from "next/link";
import PageHero from "./components/PageHero";

export default function NotFound() {
  return (
    <>
      <PageHero title="404" />
      <section>
        <div className="nx-404">
          <div className="w-layout-blockcontainer main-container w-container">
            <h2 style={{ textTransform: "uppercase", fontSize: "clamp(30px,4vw,52px)", marginBottom: 20 }}>This page took a wrong turn.</h2>
            <p>The page you are looking for does not exist or has moved. Let us get you back on track.</p>
            <Link href="/" className="nx-btn">back to home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
