export function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat("en-US").format(amount)}₮`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} мин`;
  return m === 0 ? `${h} цаг` : `${h} цаг ${m} мин`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
