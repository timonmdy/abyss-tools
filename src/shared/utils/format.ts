import type { TimeUnit } from '../types';

export function formatValue(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(2) + 'K';
  return n.toFixed(2);
}

const TIME_DIVISORS: Record<TimeUnit, number> = {
  second: 3600,
  minute: 60,
  hour: 1,
  day: 1 / 24,
};

const TIME_SUFFIXES: Record<TimeUnit, string> = {
  second: '/sec',
  minute: '/min',
  hour: '/hr',
  day: '/day',
};

/** Scale a per-hour value to the chosen time unit */
export function scaleToUnit(perHourValue: number, unit: TimeUnit): number {
  return perHourValue / TIME_DIVISORS[unit];
}

export function timeSuffix(unit: TimeUnit): string {
  return TIME_SUFFIXES[unit];
}
