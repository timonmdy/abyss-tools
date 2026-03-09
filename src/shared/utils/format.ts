import type { TimeUnit } from '../types';

/** Format a number with 2 decimal places, K/M suffixes for large values */
export function formatValue(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(2) + 'K';
  return n.toFixed(2);
}

// ─── Manual time-unit scaling (used by settings time-unit override) ───────────

const TIME_MULTIPLIERS: Record<TimeUnit, number> = {
  second: 1,
  minute: 60,
  hour:   3600,
  day:    86400,
};

const TIME_SUFFIXES: Record<TimeUnit, string> = {
  second: '/sec',
  minute: '/min',
  hour:   '/hr',
  day:    '/day',
};

export function scaleToUnit(perSecondValue: number, unit: TimeUnit): number {
  return perSecondValue * TIME_MULTIPLIERS[unit];
}

export function timeSuffix(unit: TimeUnit): string {
  return TIME_SUFFIXES[unit];
}

// ─── Auto time-unit formatting ────────────────────────────────────────────────

/**
 * Picks the most readable unit for a per-second value.
 * Uses the smallest unit whose displayed value is >= 1, capped at /day.
 *
 *   perSec  >= 1  →  /sec
 *   perMin  >= 1  →  /min
 *   perHour >= 1  →  /hr
 *   otherwise     →  /day  (even if < 1, it's the largest unit we have)
 */
export function autoFormatValue(perSecondValue: number): { display: string; suffix: string } {
  if (perSecondValue <= 0) return { display: '0.00', suffix: '/sec' };

  const perSec  = perSecondValue;
  const perMin  = perSecondValue * 60;
  const perHour = perSecondValue * 3600;
  const perDay  = perSecondValue * 86400;

  if (perSec  >= 1) return { display: formatValue(perSec),  suffix: '/sec' };
  if (perMin  >= 1) return { display: formatValue(perMin),  suffix: '/min' };
  if (perHour >= 1) return { display: formatValue(perHour), suffix: '/hr'  };
  return               { display: formatValue(perDay),  suffix: '/day' };
}
