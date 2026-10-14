import { router, type Href } from "expo-router";
import { Minus, Plus } from "lucide-react-native";
import type { ReactNode } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text as RNText,
  TextInput,
  View,
  type ImageSourcePropType,
  type TextInputProps,
  type TextProps,
  type ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import { colors } from "@/lib/colors";
import { cn } from "@/lib/utils";

/* ------------------------------ Screen & text ---------------------------- */
// Page wrapper: scrolls, and keeps inputs above the keyboard.
// `inset` adds space for the iPhone home bar on screens that have no tab bar.
export function Screen({ children, inset }: { children: ReactNode; inset?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-bg"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={{ paddingBottom: inset ? insets.bottom : 0 }}
    >
      {children}
    </ScrollView>
  );
}

// Every piece of text in the app uses this so it gets the Inter font and the default color.
export function Text({ className, ...p }: TextProps) {
  return <RNText className={cn("font-inter text-fg", className)} {...p} />;
}

/* ------------------------------ Buttons ---------------------------------- */
const VARIANTS = {
  primary: { box: "bg-primary", text: "text-cream" },
  gold: { box: "bg-gold", text: "text-ink" },
  outline: { box: "border border-mint", text: "text-cream" },
  outlineLight: { box: "border border-cream/70", text: "text-cream" },
  subtle: { box: "bg-raised", text: "text-cream" },
} as const;
const SIZES = {
  sm: { box: "h-9 px-4", text: "text-sm" },
  md: { box: "h-11 px-5", text: "text-[15px]" },
  lg: { box: "h-14 px-7", text: "text-base" },
} as const;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  onPress,
  disabled,
}: {
  children: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  href?: string; // go to another screen
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => (href ? router.push(href as Href) : onPress?.())}
      className={cn(
        "flex-row items-center justify-center rounded-full active:opacity-80",
        VARIANTS[variant].box,
        SIZES[size].box,
        disabled && "opacity-50",
        className,
      )}
    >
      <Text className={cn("font-inter-semibold", VARIANTS[variant].text, SIZES[size].text)}>{children}</Text>
    </Pressable>
  );
}

/* ------------------------------ Surfaces --------------------------------- */
export function Card({ className, ...p }: ViewProps) {
  return <View className={cn("rounded-[18px] border border-line bg-card", className)} {...p} />;
}

const PILLS = {
  gold: { box: "bg-gold-soft", text: "text-gold-text" },
  cancelled: { box: "bg-[#3d1e19]", text: "text-[#f08a78]" },
} as const;
export function Pill({ kind = "gold", children, className }: { kind?: keyof typeof PILLS; children: string; className?: string }) {
  return (
    <View className={cn("self-start rounded-full px-3 py-[5px]", PILLS[kind].box, className)}>
      <Text className={cn("font-inter-semibold text-[12.5px] leading-none", PILLS[kind].text)}>{children}</Text>
    </View>
  );
}

export function Chip({ active, onPress, children }: { active?: boolean; onPress?: () => void; children: string }) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "h-10 items-center justify-center rounded-full border px-4",
        active ? "border-primary bg-primary" : "border-border bg-card",
      )}
    >
      <Text className={cn("text-sm", active ? "font-inter-semibold text-cream" : "text-fg")}>{children}</Text>
    </Pressable>
  );
}

/* ------------------------------ Forms ------------------------------------ */
export function Input({ className, ...p }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      className={cn(
        "h-11 rounded-[10px] border border-border bg-field px-4 font-inter text-[15px] text-fg focus:border-gold",
        className,
      )}
      {...p}
    />
  );
}

export function Textarea({ className, ...p }: TextInputProps) {
  return <Input multiline textAlignVertical="top" className={cn("h-auto min-h-[110px] py-3", className)} {...p} />;
}

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <View className={className}>
      <Text className="font-inter-semibold mb-1.5 text-[13px]">{label}</Text>
      {children}
    </View>
  );
}

export function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        onPress={() => onChange(Math.max(0, value - 1))}
        className="h-[30px] w-[30px] items-center justify-center rounded-full border border-border active:opacity-70"
      >
        <Minus size={14} color={colors.fg} />
      </Pressable>
      <Text className="font-inter-semibold min-w-4 text-center text-base">{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        className="h-[30px] w-[30px] items-center justify-center rounded-full bg-primary active:opacity-70"
      >
        <Plus size={14} color={colors.cream} />
      </Pressable>
    </View>
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

// Fills its parent. Shows the image, or a plate placeholder when there is no image yet.
export function Photo({ src, tone = 0, label }: { src?: ImageSourcePropType | null; tone?: number; label?: string }) {
  if (src) return <Image source={src} resizeMode="cover" style={{ width: "100%", height: "100%" }} />;
  const [bg, ac] = TONES[Math.abs(tone) % TONES.length];
  return (
    <View className="h-full w-full items-center justify-center overflow-hidden" style={{ backgroundColor: bg }}>
      <Svg width="55%" height="55%" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="22" fill={ac} />
        <Circle cx="50" cy="50" r="15.5" fill="#fff" fillOpacity={0.07} />
        <Path d="M18 34v32M82 34v32" stroke={ac} strokeWidth={4} strokeLinecap="round" />
      </Svg>
      {label && <Text className="absolute bottom-3 left-3.5 text-xs text-[#b7c5bd]/70">{label}</Text>}
    </View>
  );
}

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="24" fill="#1f3d36" />
      <Circle cx="24" cy="24" r="21" fill="none" stroke="#e5ad3c" strokeWidth={1.5} />
      <Circle cx="24" cy="24" r="17.3" fill="#f6efe2" />
      <SvgText x="24" y="31" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1f3d36" fontFamily="PlayfairDisplay_700Bold">
        R
      </SvgText>
    </Svg>
  );
}

/* ------------------------------ Headings --------------------------------- */
export function SectionTitle({ title, sub, center }: { title: string; sub?: string; center?: boolean }) {
  return (
    <View className={cn("mb-7", center && "items-center")}>
      <Text className={cn("font-display text-[30px] leading-9 text-cream", center && "text-center")}>{title}</Text>
      {sub && <Text className={cn("mt-2 text-base leading-6 text-muted", center && "text-center")}>{sub}</Text>}
    </View>
  );
}

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <View className="border-b border-line bg-raised px-4 py-10">
      <Text className="font-display text-4xl leading-[44px] text-cream">{title}</Text>
      {sub && <Text className="mt-3 text-base leading-6 text-muted">{sub}</Text>}
    </View>
  );
}
