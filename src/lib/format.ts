export function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat("en-US").format(amount)}₮`;
}

export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} мин`;
  return m === 0 ? `${h} цаг` : `${h} цаг ${m} мин`;
}

export function formatRating(rating: number): string {
  return rating ? rating.toFixed(1) : "—";
}
