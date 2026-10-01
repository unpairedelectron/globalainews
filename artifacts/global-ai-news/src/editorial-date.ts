import type { Story } from './content';

export function getLatestStory<T extends Pick<Story, 'date'>>(items: T[]): T | undefined {
  return items.reduce<T | undefined>(
    (latest, item) => (!latest || item.date > latest.date ? item : latest),
    undefined,
  );
}

export function formatEditorialDate(value: string): string {
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}