// Glowing vertical "curtain" stripes for the home hero. Pure CSS (opacity pulse only): no canvas, no cursor tracking.
// Bars are wider and brighter at the screen edge and thin out toward the centre.
const W = [30, 26, 22, 19, 16, 14, 12, 10, 9, 8, 7, 6];

export default function HeroCurtains() {
  return (
    <>
      {(["left", "right"] as const).map((side) => (
        <div key={side} className={`nx-curtain is-${side}`} aria-hidden="true">
          {W.map((w, i) => <i key={i} style={{ flexGrow: w, ["--i" as string]: i } as React.CSSProperties} />)}
        </div>
      ))}
    </>
  );
}
