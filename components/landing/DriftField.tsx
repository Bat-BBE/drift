"use client";

const NODES = [
  {
    x: 12,
    y: 22,
    r: 5,
    color: "var(--brand-cyan, #4fd1ff)",
    dur: 22,
    delay: 0,
  },
  {
    x: 78,
    y: 15,
    r: 4,
    color: "var(--brand-pink, #ff6fa5)",
    dur: 26,
    delay: 3,
  },
  { x: 34, y: 40, r: 3.5, color: "var(--brand, #7c5cff)", dur: 19, delay: 1.5 },
  {
    x: 60,
    y: 55,
    r: 6,
    color: "var(--brand-cyan, #4fd1ff)",
    dur: 24,
    delay: 5,
  },
  { x: 88, y: 62, r: 3, color: "var(--brand, #7c5cff)", dur: 20, delay: 2 },
  {
    x: 20,
    y: 72,
    r: 4.5,
    color: "var(--brand-pink, #ff6fa5)",
    dur: 28,
    delay: 4,
  },
  { x: 47, y: 12, r: 3, color: "var(--brand, #7c5cff)", dur: 18, delay: 6 },
  {
    x: 8,
    y: 50,
    r: 3.5,
    color: "var(--brand-cyan, #4fd1ff)",
    dur: 25,
    delay: 1,
  },
  {
    x: 68,
    y: 82,
    r: 4,
    color: "var(--brand-pink, #ff6fa5)",
    dur: 21,
    delay: 3.5,
  },
  { x: 92, y: 30, r: 3, color: "var(--brand, #7c5cff)", dur: 23, delay: 2.5 },
];

const SPARKS = [
  { from: 0, to: 2, delay: 0 },
  { from: 3, to: 4, delay: 6 },
  { from: 5, to: 7, delay: 12 },
  { from: 1, to: 9, delay: 9 },
];

export function DriftField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-80"
      >
        {SPARKS.map((s, i) => {
          const a = NODES[s.from];
          const b = NODES[s.to];
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--brand, #7c5cff)"
              strokeWidth={0.15}
              className="drift-spark"
              style={{ animationDelay: `${s.delay}s` }}
            />
          );
        })}

        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r / 10}
            fill={n.color}
            className="drift-node"
            style={{
              animationDuration: `${n.dur}s`,
              animationDelay: `${n.delay}s`,
              filter: "blur(0.4px)",
            }}
          />
        ))}
      </svg>

      <style>{`
        .drift-node {
          transform-box: fill-box;
          transform-origin: center;
          animation-name: drift-move;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          opacity: 0.85;
        }
        @keyframes drift-move {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2.5px, -3px) scale(1.15); }
          100% { transform: translate(-2px, 2.5px) scale(0.9); }
        }
        .drift-spark {
          stroke-dasharray: 4 96;
          stroke-dashoffset: 100;
          opacity: 0;
          animation: drift-spark-flow 14s ease-in-out infinite;
        }
        @keyframes drift-spark-flow {
          0%, 82% { opacity: 0; stroke-dashoffset: 100; }
          86% { opacity: 0.55; }
          92% { opacity: 0.55; stroke-dashoffset: 0; }
          100% { opacity: 0; stroke-dashoffset: -20; }
        }
        @media (prefers-reduced-motion: reduce) {
          .drift-node, .drift-spark { animation: none !important; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
