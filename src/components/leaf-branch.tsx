import { cn } from "@/lib/utils";

function Flower({
  cx,
  cy,
  scale = 1,
  color,
  rotate = 0,
  animDelay = 0,
  animDuration = 4,
}: {
  cx: number;
  cy: number;
  scale?: number;
  color: string;
  rotate?: number;
  animDelay?: number;
  animDuration?: number;
}) {
  return (
    <g
      transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}
      style={{
        animation: `soft-pulse ${animDuration}s ease-in-out ${animDelay}s infinite`,
      }}
    >
      <g transform="rotate(0)">
        <ellipse cy="-3.6" rx="2.4" ry="3.8" fill={color} opacity="1" />
      </g>
      <g transform="rotate(72)">
        <ellipse cy="-3.6" rx="2.4" ry="3.8" fill={color} opacity="1" />
      </g>
      <g transform="rotate(144)">
        <ellipse cy="-3.6" rx="2.4" ry="3.8" fill={color} opacity="1" />
      </g>
      <g transform="rotate(216)">
        <ellipse cy="-3.6" rx="2.4" ry="3.8" fill={color} opacity="1" />
      </g>
      <g transform="rotate(288)">
        <ellipse cy="-3.6" rx="2.4" ry="3.8" fill={color} opacity="1" />
      </g>
      <circle r="2" fill="var(--color-petal)" opacity="1" />
      <circle r="0.9" fill="#8a4a1f" opacity="0.9" />
    </g>
  );
}

function Sparkle({
  cx,
  cy,
  scale = 1,
  animDelay = 0,
  animDuration = 2.6,
}: {
  cx: number;
  cy: number;
  scale?: number;
  animDelay?: number;
  animDuration?: number;
}) {
  return (
    <g
      transform={`translate(${cx} ${cy}) scale(${scale})`}
      style={{
        animation: `sparkle-twinkle ${animDuration}s ease-in-out ${animDelay}s infinite`,
      }}
    >
      <circle r="3.5" fill="#c9a35c" opacity="0.3" />
      <circle r="1.6" fill="#d4a017" opacity="1" />
    </g>
  );
}

function Bud({
  cx,
  cy,
  color,
  scale = 1,
  animDelay = 0,
  animDuration = 3.5,
}: {
  cx: number;
  cy: number;
  color: string;
  scale?: number;
  animDelay?: number;
  animDuration?: number;
}) {
  return (
    <g
      transform={`translate(${cx} ${cy}) scale(${scale})`}
      style={{
        animation: `soft-pulse ${animDuration}s ease-in-out ${animDelay}s infinite`,
      }}
    >
      <circle r="2.2" fill={color} opacity="0.9" />
      <circle r="1.2" cx="-0.5" cy="-0.5" fill={color} opacity="1" />
    </g>
  );
}

export function LeafBranch({
  className,
  offset = 0,
}: {
  className?: string;
  offset?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={cn("pointer-events-none absolute", className)}
    >
      {/* Ana sap */}
      <path
        d="M 200 0 Q 165 35 135 75 Q 105 115 70 150 Q 50 170 30 185"
        stroke="var(--color-sage-deep)"
        strokeWidth="1.4"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />

      {/* Yan sap 1 - sağ */}
      <path
        d="M 158 48 Q 178 55 195 50"
        stroke="var(--color-sage-deep)"
        strokeWidth="1"
        fill="none"
        opacity="0.35"
        strokeLinecap="round"
      />

      {/* Yan sap 2 - sol */}
      <path
        d="M 96 118 Q 78 105 60 92"
        stroke="var(--color-sage-deep)"
        strokeWidth="1"
        fill="none"
        opacity="0.35"
        strokeLinecap="round"
      />

      {/* Yan sap 3 - alt sağ */}
      <path
        d="M 62 155 Q 80 165 92 175"
        stroke="var(--color-sage-deep)"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        strokeLinecap="round"
      />

      {/* Sol taraf yaprakları (açık yeşil) */}
      <g>
        <ellipse cx="178" cy="18" rx="14" ry="5.5" fill="var(--color-sage)" opacity="0.7" transform="rotate(-50 178 18)" />
        <ellipse cx="158" cy="48" rx="17" ry="7" fill="var(--color-sage)" opacity="0.75" transform="rotate(-45 158 48)" />
        <ellipse cx="128" cy="82" rx="19" ry="8" fill="var(--color-sage)" opacity="0.8" transform="rotate(-40 128 82)" />
        <ellipse cx="96" cy="118" rx="21" ry="9" fill="var(--color-sage)" opacity="0.8" transform="rotate(-35 96 118)" />
        <ellipse cx="62" cy="155" rx="18" ry="8" fill="var(--color-sage)" opacity="0.7" transform="rotate(-28 62 155)" />
        <ellipse cx="35" cy="183" rx="14" ry="6" fill="var(--color-sage)" opacity="0.6" transform="rotate(-22 35 183)" />
      </g>

      {/* Sağ taraf yaprakları (koyu yeşil) */}
      <g>
        <ellipse cx="192" cy="34" rx="13" ry="5" fill="var(--color-sage-deep)" opacity="0.6" transform="rotate(42 192 34)" />
        <ellipse cx="172" cy="62" rx="16" ry="6.5" fill="var(--color-sage-deep)" opacity="0.6" transform="rotate(36 172 62)" />
        <ellipse cx="144" cy="98" rx="18" ry="7.5" fill="var(--color-sage-deep)" opacity="0.65" transform="rotate(30 144 98)" />
        <ellipse cx="112" cy="135" rx="19" ry="8" fill="var(--color-sage-deep)" opacity="0.7" transform="rotate(24 112 135)" />
        <ellipse cx="80" cy="170" rx="17" ry="7" fill="var(--color-sage-deep)" opacity="0.6" transform="rotate(18 80 170)" />
      </g>

      {/* Yan saplardaki küçük yapraklar */}
      <g>
        <ellipse cx="195" cy="52" rx="10" ry="4" fill="var(--color-sage)" opacity="0.65" transform="rotate(15 195 52)" />
        <ellipse cx="62" cy="92" rx="11" ry="4.5" fill="var(--color-sage-deep)" opacity="0.55" transform="rotate(-75 62 92)" />
        <ellipse cx="90" cy="174" rx="9" ry="4" fill="var(--color-sage)" opacity="0.6" transform="rotate(60 90 174)" />
      </g>

      {/* Büyük çiçekler — her biri farklı pulse zamanı */}
      <Flower cx={150} cy={62} scale={1.5} color="var(--color-blush)" animDelay={0 + offset} animDuration={4.2} />
      <Flower cx={108} cy={102} scale={1.8} color="var(--color-coral)" rotate={20} animDelay={1.6 + offset} animDuration={5} />
      <Flower cx={70} cy={140} scale={1.4} color="var(--color-rose)" rotate={-15} animDelay={2.8 + offset} animDuration={4.5} />
      <Flower cx={42} cy={172} scale={1.1} color="var(--color-blush-soft)" rotate={30} animDelay={0.9 + offset} animDuration={3.8} />

      {/* Küçük tomurcuklar — birbirinden bağımsız */}
      <Bud cx={186} cy={40} color="var(--color-coral)" scale={1.2} animDelay={0.4 + offset} animDuration={3.2} />
      <Bud cx={130} cy={120} color="var(--color-rose)" scale={1} animDelay={2.1 + offset} animDuration={4} />
      <Bud cx={95} cy={80} color="var(--color-blush)" scale={0.9} animDelay={3.4 + offset} animDuration={3.5} />
      <Bud cx={55} cy={120} color="var(--color-coral)" scale={1.1} animDelay={1.2 + offset} animDuration={4.2} />
      <Bud cx={22} cy={165} color="var(--color-rose)" scale={0.8} animDelay={2.6 + offset} animDuration={3.6} />
      <Bud cx={170} cy={88} color="var(--color-blush-soft)" scale={0.85} animDelay={0.2 + offset} animDuration={3.8} />

      {/* Sarı ışıltı noktaları — çiçeklerin aralarında */}
      <Sparkle cx={165} cy={42} animDelay={0.3 + offset} animDuration={2.4} scale={1} />
      <Sparkle cx={120} cy={70} animDelay={1.5 + offset} animDuration={2.8} scale={0.7} />
      <Sparkle cx={140} cy={140} animDelay={0.7 + offset} animDuration={2.6} scale={1.1} />
      <Sparkle cx={88} cy={158} animDelay={2.2 + offset} animDuration={2.5} scale={0.8} />
      <Sparkle cx={50} cy={100} animDelay={1.1 + offset} animDuration={3} scale={0.9} />
      <Sparkle cx={28} cy={145} animDelay={1.8 + offset} animDuration={2.7} scale={0.75} />
    </svg>
  );
}
