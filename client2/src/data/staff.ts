import type { Staff } from "./types";

const hoursAgo = (h: number) => Date.now() - h * 3600000;

// PLACEHOLDER
export const staff: Staff[] = [
  { id: "s1", name: "Marko K.", username: "marko", role: "admin", active: true, lastLogin: hoursAgo(1) },
  { id: "s2", name: "Jelena S.", username: "jelena", role: "staff", active: true, lastLogin: hoursAgo(5) },
  { id: "s3", name: "Dragan P.", username: "dragan", role: "staff", active: true, lastLogin: hoursAgo(26) },
  { id: "s4", name: "Nina M.", username: "nina", role: "staff", active: true, lastLogin: hoursAgo(72) },
  { id: "s5", name: "Vuk T.", username: "vuk", role: "staff", active: false, lastLogin: hoursAgo(24 * 40) },
];
