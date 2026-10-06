import type { DiningTable } from "@/types";

type TableState = "free" | "sel" | "res";

const STYLE = {
  free: {
    fill: "#15221d",
    stroke: "#8fc3ab",
    sw: 2.5,
    text: "#f3ead8",
    seatFill: "#182720",
    seatStroke: "#8fc3ab",
  },
  sel: {
    fill: "#2c6653",
    stroke: "#e5ad3c",
    sw: 3,
    text: "#f3ead8",
    seatFill: "transparent",
    seatStroke: "#e5ad3c",
  },
  res: {
    fill: "#222b27",
    stroke: "#39443e",
    sw: 2,
    text: "#6b7972",
    seatFill: "#222b27",
    seatStroke: "#39443e",
  },
} as const;

export const tableRadius = (t: DiningTable) => (t.seats <= 4 ? 34 : 42);
export const tableWidth = (t: DiningTable) =>
  t.w && t.w > 0 ? t.w : Math.round(20 + t.seats * 18.5);
const TABLE_H = 52;

/** Seat centers relative to the table center. */
export function seatPoints(
  t: DiningTable,
  sr: number,
  gap: number,
  r = tableRadius(t),
): { x: number; y: number }[] {
  if (t.shape === "round") {
    return Array.from({ length: t.seats }, (_, i) => {
      const a = ((-90 + (360 * i) / t.seats) * Math.PI) / 180;
      return {
        x: (r + gap + sr) * Math.cos(a),
        y: (r + gap + sr) * Math.sin(a),
      };
    });
  }
  const w = tableWidth(t);
  const top = Math.ceil(t.seats / 2),
    bottom = Math.floor(t.seats / 2);
  const pts: { x: number; y: number }[] = [];
  for (let k = 0; k < top; k++)
    pts.push({ x: -w / 2 + (w * (k + 0.5)) / top, y: -TABLE_H / 2 - gap - sr });
  for (let k = 0; k < bottom; k++)
    pts.push({
      x: -w / 2 + (w * (k + 0.5)) / bottom,
      y: TABLE_H / 2 + gap + sr,
    });
  return pts;
}

type ShapeProps = {
  table: DiningTable;
  state: TableState;
  guests?: (string | null)[]; // initials per seat (selected tables only)
  sr?: number;
  gap?: number;
  radius?: number;
  sub?: boolean;
  onClick?: () => void;
  onSeatClick?: (seatIndex: number) => void;
  label?: string;
};

export function TableShape({
  table,
  state,
  guests,
  sr = 11,
  gap = 8,
  radius,
  sub = true,
  onClick,
  onSeatClick,
  label,
}: ShapeProps) {
  const s = STYLE[state];
  const r = radius ?? tableRadius(table);
  const seats = seatPoints(table, sr, gap, r);
  const clickable = Boolean(onClick) && state !== "res";
  const fs =
    table.shape === "round"
      ? Math.max(11, r * 0.38)
      : Math.max(11, TABLE_H * 0.28);
  const sub2 = state === "res" ? "Reserved" : `${table.seats} seats`;
  const showSub = sub && (table.shape === "rect" || r >= 32);
  const title = label ?? table.label;
  return (
    <g
      transform={`translate(${table.x} ${table.y})`}
      onClick={clickable ? onClick : undefined}
      style={{ cursor: clickable ? "pointer" : "default" }}
      role={clickable ? "button" : undefined}
      aria-label={
        clickable ? `Table ${table.label}, ${table.seats} seats` : undefined
      }
    >
      {seats.map((p, i) => {
        const guest = guests?.[i];
        const filled = state === "sel" && guest;
        return (
          <g
            key={i}
            onClick={
              onSeatClick
                ? (e) => {
                    e.stopPropagation();
                    onSeatClick(i);
                  }
                : undefined
            }
            style={{ cursor: onSeatClick ? "pointer" : undefined }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={sr}
              fill={filled ? "#e5ad3c" : s.seatFill}
              stroke={filled ? "none" : s.seatStroke}
              strokeWidth={state === "sel" ? 1.8 : 1.5}
              strokeDasharray={state === "sel" && !guest ? "3 3" : undefined}
            />
            {filled && (
              <text
                x={p.x}
                y={p.y + sr * 0.34}
                textAnchor="middle"
                fontSize={sr * 0.85}
                fontWeight={700}
                fill="#0a110f"
              >
                {guest}
              </text>
            )}
          </g>
        );
      })}
      {table.shape === "round" ? (
        <circle r={r} fill={s.fill} stroke={s.stroke} strokeWidth={s.sw} />
      ) : (
        <rect
          x={-tableWidth(table) / 2}
          y={-TABLE_H / 2}
          width={tableWidth(table)}
          height={TABLE_H}
          rx={10}
          fill={s.fill}
          stroke={s.stroke}
          strokeWidth={s.sw}
        />
      )}
      {showSub ? (
        <>
          <text
            y={-1}
            textAnchor="middle"
            fontSize={fs}
            fontWeight={700}
            fill={s.text}
          >
            {title}
          </text>
          <text
            y={fs * 0.95}
            textAnchor="middle"
            fontSize={Math.max(9, fs * 0.6)}
            fontWeight={500}
            fill={s.text}
            opacity={0.85}
          >
            {sub2}
          </text>
        </>
      ) : (
        <text
          y={fs * 0.35}
          textAnchor="middle"
          fontSize={fs}
          fontWeight={700}
          fill={s.text}
        >
          {title}
        </text>
      )}
    </g>
  );
}

export const ROOM_W = 760;
export const ROOM_H = 570;

/** The room outline (kitchen, bar, entrance) shared by every floor plan. */
export function Room({
  children,
  grid,
}: {
  children: React.ReactNode;
  grid?: boolean;
}) {
  return (
    <>
      <rect
        x="1.5"
        y="1.5"
        width={ROOM_W - 3}
        height={ROOM_H - 3}
        rx="16"
        fill="#182822"
        stroke="#33493f"
        strokeWidth="3"
      />
      {grid &&
        Array.from({ length: 18 }).flatMap((_, i) =>
          Array.from({ length: 13 }).map((_, j) => (
            <circle
              key={`${i}-${j}`}
              cx={40 * (i + 1)}
              cy={40 * (j + 1)}
              r="1.3"
              fill="#33493f"
            />
          )),
        )}
      <rect x="16" y="16" width="200" height="56" rx="8" fill="#22362f" />
      <text
        x="116"
        y="50"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="#97a89f"
      >
        Kitchen
      </text>
      <rect x="544" y="16" width="200" height="56" rx="8" fill="#22362f" />
      <text
        x="644"
        y="50"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="#97a89f"
      >
        Bar
      </text>
      {children}
      <line
        x1="300"
        y1={ROOM_H - 1.5}
        x2="460"
        y2={ROOM_H - 1.5}
        stroke="#182822"
        strokeWidth="6"
      />
      <text
        x="380"
        y={ROOM_H - 18}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#97a89f"
      >
        Entrance
      </text>
    </>
  );
}
