import { useState, useEffect, useRef } from 'react';
import type { AppSettings } from '../types';

// ─── Tab registry ─────────────────────────────────────────────────────────────
// Each tab has an id, a label shown in the sidebar, and the panel content.
// App-specific tabs are passed in via the `extraTabs` prop.

export interface SettingsTab {
  id: string;
  icon: string;
  label: string;
  panel: React.ReactNode;
}

interface SettingsModalProps {
  settings: AppSettings;
  onUpdate: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onClose: () => void;
  /** Which tab to open first — defaults to 'general' */
  initialTab?: string;
  /** Additional app-specific tabs to append after the built-in ones */
  extraTabs?: SettingsTab[];
}

// ─── Re-usable primitives ────────────────────────────────────────────────────

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className="text-sm font-semibold text-slate-200">{label}</div>
        {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
        style={{
          background: checked ? 'rgba(34,211,238,0.4)' : 'rgba(30,58,74,0.8)',
          border: `1px solid ${checked ? 'rgba(34,211,238,0.6)' : 'rgba(8,60,90,0.8)'}`,
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200"
          style={{
            background: checked ? '#22d3ee' : '#334155',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            boxShadow: checked ? '0 0 8px rgba(34,211,238,0.6)' : 'none',
          }}
        />
      </button>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/50 mb-3 mt-1">
      {children}
    </div>
  );
}

// ─── Built-in tab panels ──────────────────────────────────────────────────────

function GeneralPanel({
  settings,
  onUpdate,
}: {
  settings: AppSettings;
  onUpdate: SettingsModalProps['onUpdate'];
}) {
  return (
    <div>
      <SectionHeading>Display</SectionHeading>
      <div className="border-b border-[rgba(8,60,90,0.4)] mb-4">
        <Toggle
          label="Background Effects"
          description="Animated bubbles and water glow"
          checked={settings.backgroundEffects}
          onChange={(v) => onUpdate('backgroundEffects', v)}
        />
      </div>
    </div>
  );
}

function PondCalculatorPanel() {
  return (
    <div>
      <SectionHeading>Time Unit</SectionHeading>
      <p className="text-xs text-slate-500 leading-relaxed">
        Time unit is selected automatically based on the result magnitude:
      </p>
      <div className="mt-3 flex flex-col gap-1.5 text-xs">
        {[
          { range: '≤ 60',   unit: '/sec' },
          { range: '≤ 60',   unit: '/min' },
          { range: '≤ 24',   unit: '/hr'  },
          { range: 'above',  unit: '/day' },
        ].map(({ range, unit }) => (
          <div key={unit} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a1628]/60 border border-[rgba(8,60,90,0.4)]">
            <span className="text-cyan-400/70 font-mono w-12 shrink-0">{range}</span>
            <span className="text-slate-400">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function SettingsModal({
  settings,
  onUpdate,
  onClose,
  initialTab = 'general',
  extraTabs = [],
}: SettingsModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Built-in tabs — always present
  const builtInTabs: SettingsTab[] = [
    {
      id: 'general',
      icon: '🎨',
      label: 'General',
      panel: <GeneralPanel settings={settings} onUpdate={onUpdate} />,
    },
    {
      id: 'pond-calculator',
      icon: '🐟',
      label: 'Pond Calc',
      panel: <PondCalculatorPanel />,
    },
  ];

  const allTabs: SettingsTab[] = [...builtInTabs, ...extraTabs];

  // Validate initialTab — fall back to first tab if unknown
  const resolvedInitial = allTabs.find((t) => t.id === initialTab)
    ? initialTab
    : allTabs[0].id;

  const [activeTab, setActiveTab] = useState(resolvedInitial);
  const currentPanel = allTabs.find((t) => t.id === activeTab)?.panel;

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,8,16,0.8)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
      onMouseDown={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        className="w-full flex overflow-hidden rounded-2xl border"
        style={{
          maxWidth: '560px',
          background: '#071020',
          borderColor: 'rgba(34,211,238,0.2)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(34,211,238,0.06)',
          animation: 'result-pop 0.25s ease both',
          minHeight: '340px',
        }}
      >
        {/* ── Sidebar ── */}
        <div
          className="flex flex-col shrink-0 border-r border-[rgba(8,60,90,0.6)]"
          style={{ width: '140px', background: 'rgba(5,13,26,0.6)' }}
        >
          {/* Logo / title */}
          <div className="px-4 pt-5 pb-4 border-b border-[rgba(8,60,90,0.4)]">
            <div
              className="font-black text-sm tracking-tight"
              style={{ fontFamily: "'Exo 2', sans-serif", color: '#67e8f9' }}
            >
              ⚙️ Settings
            </div>
          </div>

          {/* Tab list */}
          <nav className="flex flex-col gap-0.5 p-2 flex-1">
            {allTabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                    text-left transition-all duration-150 w-full"
                  style={{
                    background: isActive ? 'rgba(34,211,238,0.1)' : 'transparent',
                    color: isActive ? '#67e8f9' : '#475569',
                    border: `1px solid ${isActive ? 'rgba(34,211,238,0.3)' : 'transparent'}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.color = '#475569';
                  }}
                >
                  <span className="text-base leading-none">{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* ── Content area ── */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Content header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[rgba(8,60,90,0.4)]">
            <div className="text-sm font-bold text-slate-300" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              {allTabs.find((t) => t.id === activeTab)?.icon}{' '}
              {allTabs.find((t) => t.id === activeTab)?.label}
            </div>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-300 transition-colors text-lg leading-none
                w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5"
            >
              ✕
            </button>
          </div>

          {/* Panel */}
          <div className="flex-1 px-6 py-5 overflow-y-auto">
            {currentPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
