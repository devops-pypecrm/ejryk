import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import { WorkGrid, CtaBand } from "../components/Sections";
import { WORK } from "../../data/work";

export const metadata: Metadata = { title: "Work", description: "Selected products, brands and systems we have designed, built and grown." };

export default function WorkPage() {
  return (
    <>
      <PageHero title="work" sub="Selected products, brands and systems, from first sketch to scaled growth." />
      <section>
        <div className="work" style={{ paddingTop: 90 }}>
          <div className="w-layout-blockcontainer main-container w-container">
            <WorkGrid items={WORK} />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
