// Decorative lightning for hero sections. Pure CSS animation (opacity + dash offset), no JS, no filters.
// Each bolt is drawn as three stacked strokes (wide glow, yellow, white core) instead of a blur filter.
const BOLTS = {
  a: "M372 -20 L338 150 L408 188 L306 372 L378 404 L252 640 L292 660",
  b: "M1078 -20 L1112 132 L1042 176 L1142 350 L1070 388 L1182 600 L1148 622",
};
const BRANCH = {
  a: "M338 150 L282 210 L300 250",
  b: "M1112 132 L1170 196 L1150 236",
};

function Bolt({ id, delay }: { id: "a" | "b"; delay: string }) {
  return (
    <g className={`nx-bolt nx-bolt-${id}`} style={{ animationDelay: delay }}>
      {[BOLTS[id], BRANCH[id]].map((d, i) => (
        <g key={i}>
          <path d={d} className="g" pathLength={1} />
          <path d={d} className="y" pathLength={1} />
          <path d={d} className="w" pathLength={1} />
        </g>
      ))}
    </g>
  );
}

export default function Storm({ single = false }: { single?: boolean }) {
  return (
    <div className="nx-storm" aria-hidden="true">
      <div className="nx-flash" style={{ animationDelay: "0.9s" }} />
      {!single && <div className="nx-flash nx-flash-r" style={{ animationDelay: "4.6s" }} />}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <Bolt id="a" delay="0.9s" />
        {!single && <Bolt id="b" delay="4.6s" />}
      </svg>
      <span className="nx-kanji">雷</span>
    </div>
  );
}
