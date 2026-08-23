/** Compact number like Shields `metric`: 1280 -> 1.3k, 12800 -> 13k */
export function formatMetric(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  if (abs < 1000) return `${sign}${Math.round(abs)}`;
  if (abs < 1_000_000) {
    const scaled = abs / 1000;
    if (scaled < 10) {
      const one = scaled.toFixed(1);
      return one.endsWith(".0") ? `${sign}${Math.round(scaled)}k` : `${sign}${one}k`;
    }
    return `${sign}${Math.round(scaled)}k`;
  }
  const scaled = abs / 1_000_000;
  if (scaled < 10) {
    const one = scaled.toFixed(1);
    return one.endsWith(".0") ? `${sign}${Math.round(scaled)}M` : `${sign}${one}M`;
  }
  return `${sign}${Math.round(scaled)}M`;
}
