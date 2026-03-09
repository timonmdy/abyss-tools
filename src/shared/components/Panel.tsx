import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standard card panel used across all Abyss Tools apps.
 *
 * Intentionally omits `backdrop-filter`/`backdrop-blur` — those CSS properties
 * create a new stacking context which traps child z-indexes and causes dropdowns
 * to render behind sibling panels.
 */
export function Panel({ children, className = '' }: PanelProps) {
  return (
    <div
      className={`rounded-2xl border border-[rgba(8,60,90,0.6)] bg-[#071020] p-5 ${className}`}
      style={{ boxShadow: '0 4px 32px rgba(6,182,212,0.06)' }}
    >
      {children}
    </div>
  );
}

interface PanelHeadingProps {
  icon?: string;
  children: ReactNode;
}

export function PanelHeading({ icon, children }: PanelHeadingProps) {
  return (
    <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/60 mb-4 flex items-center gap-2">
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
}
