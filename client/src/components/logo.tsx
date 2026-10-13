export function Logo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <circle cx="24" cy="24" r="24" fill="#1f3d36" />
      <circle cx="24" cy="24" r="21" fill="none" stroke="#e5ad3c" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="17.3" fill="#f6efe2" />
      <text x="24" y="31" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1f3d36" fontFamily="'Playfair Display', Georgia, serif">R</text>
    </svg>
  );
}
