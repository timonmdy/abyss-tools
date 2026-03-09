import type { ReactNode } from 'react';
import { Bubbles } from './Bubbles';
import { APP_VERSION } from '../utils/version';

interface Crumb {
  label: string;
  onClick?: () => void;
}

interface AppShellProps {
  breadcrumbs: Crumb[];
  actions?: ReactNode;
  children: ReactNode;
  backgroundEffects?: boolean;
}

export function AppShell({
  breadcrumbs,
  actions,
  children,
  backgroundEffects = true,
}: AppShellProps) {
  return (
    <div
      className="min-h-screen relative text-slate-100"
      style={{
        background:
          'radial-gradient(ellipse at 20% 0%, #0c1f3a 0%, #050d1a 40%, #020810 100%)',
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {backgroundEffects && <Bubbles />}

      {backgroundEffects && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(6,182,212,0.05) 0%, transparent 65%)',
          }}
        />
      )}

      {/* ── Header ── */}
      <header
        className="relative z-20 border-b border-[rgba(8,60,90,0.6)]"
        style={{ background: 'rgba(5,13,26,0.85)' }}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Left: breadcrumb nav */}
          <nav className="flex items-center gap-1 min-w-0" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1 min-w-0">
                {i > 0 && (
                  <span className="text-slate-700 text-xs mx-0.5 shrink-0">/</span>
                )}
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="text-sm font-bold transition-colors duration-150 truncate shrink-0 hover:text-cyan-300"
                    style={{ fontFamily: "'Exo 2', sans-serif", color: '#475569' }}
                  >
                    {i === 0 ? (
                      <span className="flex items-center gap-1.5">
                        <span>🌊</span><span>{crumb.label}</span>
                      </span>
                    ) : crumb.label}
                  </button>
                ) : (
                  <span
                    className="text-sm font-bold truncate"
                    style={{ fontFamily: "'Exo 2', sans-serif", color: i === 0 ? '#67e8f9' : '#e2e8f0' }}
                  >
                    {i === 0 ? (
                      <span className="flex items-center gap-1.5">
                        <span>🌊</span><span>{crumb.label}</span>
                      </span>
                    ) : crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Right: action slot */}
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 pb-16">
        {children}
      </main>

      <footer className="relative z-10 text-center text-slate-800 text-xs pb-6 tracking-widest uppercase">
        Abyss Tools · v{APP_VERSION}
      </footer>
    </div>
  );
}
