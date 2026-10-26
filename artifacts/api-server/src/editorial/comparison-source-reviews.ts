export const monitoredComparisonSlugs = [
  "ai-assistants-compared",
  "ai-image-tools-compared",
] as const;

export type MonitoredComparisonSlug = (typeof monitoredComparisonSlugs)[number];

export function isMonitoredComparisonSlug(value: string): value is MonitoredComparisonSlug {
  return monitoredComparisonSlugs.some((slug) => slug === value);
}

export function addOneCalendarMonth(date: Date): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const nextMonthLastDay = new Date(Date.UTC(year, month + 2, 0)).getUTCDate();
  return new Date(Date.UTC(year, month + 1, Math.min(day, nextMonthLastDay)))
    .toISOString()
    .slice(0, 10);
}
