import type { SVGProps } from "react";

const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const InstagramIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r=".8" /></svg>
);
export const FacebookIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg>
);
export const TikTokIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M14 4v10a3.5 3.5 0 1 1-3.5-3.5M14 4c0 3 2 5 5 5" /></svg>
);
