"use client";

type TableProps = {
  chairs: number;
  status: "reserved" | "selected" | "available";
  label: string;
};

const CHAIR_SIZE = 16;
const TABLE_BORDER = 2;

const COLORS = {
  available: {
    table: "border-green-primary bg-green-deep",
    chair: "border-green-primary",
  },
  selected: {
    table: "border-gold-accent bg-green-deep",
    chair: "border-gold-accent",
  },
  reserved: {
    table: "border-text-muted/30 bg-text-muted/5",
    chair: "border-text-muted/20",
  },
};

export default function Table({ chairs, status, label }: TableProps) {
  const color = COLORS[status];

  const isRound = chairs <= 6;

  if (isRound) {
    return (
      <RoundTable
        chairs={chairs}
        label={label}
        tableClass={color.table}
        chairClass={color.chair}
      />
    );
  }

  return (
    <RectangularTable
      chairs={chairs}
      label={label}
      tableClass={color.table}
      chairClass={color.chair}
    />
  );
}

function RoundTable({
  chairs,
  label,
  onClick,
  tableClass,
  chairClass,
}: {
  chairs: number;
  label: string;
  onClick?: () => void;
  tableClass: string;
  chairClass: string;
}) {
  const tableSize = 64;

  const tableRadius = tableSize / 2;
  const chairRadius = CHAIR_SIZE / 2;

  const chairDistance = tableRadius + chairRadius - TABLE_BORDER;

  const containerSize = tableSize + CHAIR_SIZE;

  return (
    <div
      className="relative"
      style={{
        width: containerSize,
        height: containerSize,
      }}
    >
      {Array.from({ length: chairs }).map((_, index) => {
        const angle = (360 / chairs) * index;

        return (
          <div
            key={index}
            className={`
              absolute
              left-1/2 top-1/2
              rounded-full
              border-2
              ${chairClass}
            `}
            style={{
              width: CHAIR_SIZE,
              height: CHAIR_SIZE,

              transform: `
                translate(-50%, -50%)
                rotate(${angle}deg)
                translateY(-${chairDistance}px)
              `,
            }}
          />
        );
      })}

      <button
        onClick={onClick}
        className={`
          absolute
          left-1/2 top-1/2
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border-2
          ${tableClass}
          flex items-center justify-center
        `}
        style={{
          width: tableSize,
          height: tableSize,
        }}
      >
        <span className="text-lg font-bold font-inter text-text">{label}</span>
      </button>
    </div>
  );
}

function RectangularTable({
  chairs,
  label,
  onClick,
  tableClass,
  chairClass,
}: {
  chairs: number;
  label: string;
  onClick?: () => void;
  tableClass: string;
  chairClass: string;
}) {
  let sideChairs: number;

  if (chairs <= 12) {
    sideChairs = 1;
  } else {
    sideChairs = 2;
  }

  const longSideSeats = chairs - sideChairs * 2;

  const top = Math.ceil(longSideSeats / 2);
  const bottom = Math.floor(longSideSeats / 2);

  const left = sideChairs;
  const right = sideChairs;

  const tableWidth = top * CHAIR_SIZE + (top - 1) * CHAIR_SIZE + 28;

  const tableHeight = 52;

  const containerWidth = tableWidth + CHAIR_SIZE;
  const containerHeight = tableHeight + CHAIR_SIZE;

  return (
    <div
      className="relative"
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {/* TOP */}

      <div
        className="
          absolute
          left-1/2
          -top-3
          flex
          -translate-x-1/2
        "
        style={{
          gap: CHAIR_SIZE,
        }}
      >
        {Array.from({ length: top }).map((_, index) => (
          <Chair key={`top-${index}`} className={chairClass} />
        ))}
      </div>

      {/* BOTTOM */}

      <div
        className="
          absolute
          -bottom-3
          left-1/2
          flex
          -translate-x-1/2
        "
        style={{
          gap: CHAIR_SIZE,
        }}
      >
        {Array.from({ length: bottom }).map((_, index) => (
          <Chair key={`bottom-${index}`} className={chairClass} />
        ))}
      </div>

      {/* LEFT */}

      {left > 0 && (
        <div
          className="
            absolute
            -left-3
            top-1/2
            -translate-y-1/2
          "
        >
          {Array.from({ length: left }).map((_, index) => (
            <Chair key={`left-${index}`} className={chairClass} />
          ))}
        </div>
      )}

      {/* RIGHT */}

      {right > 0 && (
        <div
          className="
            absolute
            -right-3
            top-1/2
            -translate-y-1/2
          "
        >
          {Array.from({ length: right }).map((_, index) => (
            <Chair key={`right-${index}`} className={chairClass} />
          ))}
        </div>
      )}

      {/* TABLE */}

      <button
        onClick={onClick}
        className={`
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          flex
          items-center
          justify-center
          rounded-lg
          border-2 
          
          ${tableClass}
        `}
        style={{
          width: tableWidth,
          height: tableHeight,
        }}
      >
        <span className="text-lg font-bold text-text font-inter">{label}</span>
      </button>
    </div>
  );
}

function Chair({ className }: { className: string }) {
  return (
    <div
      className={`
        shrink-0
        rounded-full
        border-2 p-2 
        ${className}
      `}
      style={{
        width: CHAIR_SIZE,
        height: CHAIR_SIZE,
      }}
    />
  );
}
