// ─── Shared UI primitives ────────────────────────────────────────────────────

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export type TimeUnit = 'second' | 'minute' | 'hour' | 'day';

export interface AppSettings {
  backgroundEffects: boolean;
  timeUnit: TimeUnit;
}

// ─── App registry (for home page & navigation) ────────────────────────────────

export interface AppMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;        // route key, e.g. 'pond-calculator'
  status: 'live' | 'soon';
}
