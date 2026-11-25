/** Generic hairline diamond outline used for empty states and placeholders (decorative, not the brand logo). */
export default function DiamondMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1">
      <path d="M12 8h24l8 11-20 22L4 19l8-11Z" />
      <path d="M4 19h40M17 8l-5 11 12 22M31 8l5 11-12 22" />
    </svg>
  );
}
