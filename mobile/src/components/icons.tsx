import Svg, { Circle, Path, Rect } from "react-native-svg";

// Brand icons (Lucide no longer ships them) - same drawings as the website.
type IconProps = { size?: number; color?: string };
const base = { viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const InstagramIcon = ({ size = 24, color = "#fff" }: IconProps) => (
  <Svg width={size} height={size} stroke={color} {...base}>
    <Rect x="3" y="3" width="18" height="18" rx="5" />
    <Circle cx="12" cy="12" r="4.2" />
    <Circle cx="17.5" cy="6.5" r=".8" />
  </Svg>
);
export const FacebookIcon = ({ size = 24, color = "#fff" }: IconProps) => (
  <Svg width={size} height={size} stroke={color} {...base}>
    <Path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
  </Svg>
);
export const TikTokIcon = ({ size = 24, color = "#fff" }: IconProps) => (
  <Svg width={size} height={size} stroke={color} {...base}>
    <Path d="M14 4v10a3.5 3.5 0 1 1-3.5-3.5M14 4c0 3 2 5 5 5" />
  </Svg>
);
