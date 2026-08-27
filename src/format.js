const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

/**
 * Shields-style relative date: today, yesterday, "last sunday" (2-6 days back),
 * then week/month/year buckets further out.
 */
export function formatRelativeDate(date, now = new Date()) {
  const diffDays = Math.floor((now.getTime() - date.getTime()) / DAY_MS);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `last ${WEEKDAYS[date.getDay()]}`;

  const diffWeeks = Math.round(diffDays / 7);
  if (diffDays < 31) return diffWeeks <= 1 ? "last week" : `${diffWeeks} weeks ago`;

  const diffMonths = Math.round(diffDays / 30.44);
  if (diffDays < 365) return diffMonths <= 1 ? "last month" : `${diffMonths} months ago`;

  const diffYears = Math.round(diffDays / 365.25);
  return diffYears <= 1 ? "last year" : `${diffYears} years ago`;
}

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
