import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------ Buttons ---------------------------------- */
const VARIANTS = {
  primary: "bg-primary text-cream hover:bg-primary/85",
  gold: "bg-gold text-ink hover:bg-gold/90",
  outline: "border border-mint text-cream hover:bg-white/5",
  outlineLight: "border border-cream/70 text-cream hover:bg-white/10",
  subtle: "bg-raised text-cream hover:bg-raised/70",
  light: "bg-card border border-border text-fg hover:border-gold/60",
  danger: "border border-danger text-danger hover:bg-danger/10",
  dangerFill: "bg-danger text-white hover:bg-danger/90",
  ghost: "text-muted hover:text-fg hover:bg-white/5",
} as const;
const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
} as const;

export function buttonClass(
  variant: keyof typeof VARIANTS = "primary",
  size: keyof typeof SIZES = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
};
export function Button({
  variant,
  size,
  className,
  type = "button",
  ...p
}: BtnProps) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      {...p}
    />
  );
}
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

/* ------------------------------ Surfaces --------------------------------- */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-[18px] border border-line bg-card", className)}>
      {children}
    </div>
  );
}

const PILLS = {
  new: "bg-[#1b2c52] text-[#8fb0ff]",
  preparing: "bg-[#3a2c10] text-[#f0b95a]",
  pending: "bg-[#3a2c10] text-[#f0b95a]",
  ready: "bg-[#163828] text-[#7fd0a0]",
  confirmed: "bg-[#163828] text-[#7fd0a0]",
  green: "bg-[#163828] text-[#7fd0a0]",
  delivering: "bg-[#2a2147] text-[#b9a0f0]",
  done: "bg-[#243029] text-[#93a39b]",
  dine: "bg-[#243029] text-[#93a39b]",
  staff: "bg-[#243029] text-[#93a39b]",
  cancelled: "bg-[#3d1e19] text-[#f08a78]",
  red: "bg-[#3d1e19] text-[#f08a78]",
  seated: "bg-[#1b2c52] text-[#8fb0ff]",
  admin: "bg-gold-soft text-gold-text",
  gold: "bg-gold-soft text-gold-text",
  tag: "bg-bg/90 text-cream backdrop-blur",
} as const;
export type PillKind = keyof typeof PILLS;
export function Pill({
  kind = "gold",
  children,
  className,
}: {
  kind?: PillKind;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-[5px] text-[12.5px] font-semibold leading-none whitespace-nowrap",
        PILLS[kind],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Chip({
  active,
  onClick,
  href,
  children,
  count,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  href?: string;
  children: ReactNode;
  count?: number;
  className?: string;
}) {
  const cls = cn(
    "inline-flex h-10 items-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors",
    active
      ? "border-primary bg-primary font-semibold text-cream"
      : "border-border bg-card text-fg hover:border-gold/60",
    className,
  );
  const content = (
    <>
      {children}
      {count !== undefined && <span className="ml-2 opacity-70">{count}</span>}
    </>
  );
  return href ? (
    <Link href={href} className={cls}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  );
}

/* ------------------------------ Forms ------------------------------------ */
const inputCls =
  "w-full rounded-[10px] border border-border bg-field px-4 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-gold";
export const Input = ({
  className,
  ...p
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cn(inputCls, "h-11", className)} {...p} />
);
export const Select = ({
  className,
  children,
  ...p
}: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      inputCls,
      "select-chevron h-11 appearance-none pr-10",
      className,
    )}
    {...p}
  >
    {children}
  </select>
);
export const Textarea = ({
  className,
  ...p
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(inputCls, "min-h-[110px] resize-y py-3", className)}
    {...p}
  />
);
export function Field({
  label,
  children,
  className,
  error,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <label className={cn("block", className)}>
      {label && (
        <span className="mb-1.5 block text-[13px] font-semibold">{label}</span>
      )}
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export function Toggle({
  on,
  onChange,
  label,
  disabled,
}: {
  on: boolean;
  onChange?: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      aria-label={label}
      onClick={() => onChange?.(!on)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-ok" : "bg-[#3a4741]",
        disabled ? "bg-muted/50" : "",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-cream transition-all",
          on ? "left-[23px]" : "left-[3px]",
        )}
      />
    </button>
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  size?: "sm" | "md";
}) {
  const d = size === "sm" ? "h-[26px] w-[26px]" : "h-[30px] w-[30px]";
  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          "grid place-items-center rounded-full border border-border hover:border-gold/60",
          d,
        )}
      >
        <Minus size={14} />
      </button>
      <span className="min-w-4 text-center text-base font-semibold">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(value + 1)}
        className={cn(
          "grid place-items-center rounded-full bg-primary text-cream hover:bg-primary/85",
          d,
        )}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

/* ------------------------------ Media ------------------------------------ */
const TONES = [
  ["#2a3a33", "#40574b"],
  ["#2b3a31", "#436150"],
  ["#3a3229", "#5a4b38"],
  ["#26363a", "#3b565c"],
  ["#3a2c2c", "#5c4242"],
  ["#38371f", "#565431"],
];
/** Photo with a tasteful placeholder (plate + cutlery) when there is no image yet. */
export function Photo({
  src,
  alt = "",
  tone = 0,
  label,
  className,
}: {
  src?: string | null;
  alt?: string;
  tone?: number;
  label?: string;
  className?: string;
}) {
  const [bg, ac] = TONES[Math.abs(tone) % TONES.length];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ background: bg }}
      role="img"
      aria-label={alt || label}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 m-auto h-[55%] w-[55%] max-h-40 max-w-40"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="22" fill={ac} />
        <circle cx="50" cy="50" r="15.5" fill="#fff" fillOpacity=".07" />
        <path
          d="M18 34v32M82 34v32"
          stroke={ac}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <span className="absolute bottom-3 left-3.5 text-xs font-medium text-[#b7c5bd]/70">
          {label}
        </span>
      )}
    </div>
  );
}

export function SectionTitle({
  title,
  sub,
  action,
  center,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-3",
        center && "justify-center text-center",
      )}
    >
      <div>
        <h2 className="font-display text-3xl text-cream sm:text-4xl">
          {title}
        </h2>
        {sub && (
          <p className="mt-2 text-base text-muted sm:text-[17px]">{sub}</p>
        )}
      </div>
      {action}
    </div>
  );
}
type MultiSelectOption = {
  label: string;
  value: string;
};
