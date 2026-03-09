import type { AppMeta } from './shared/types';
import { APPS } from './apps/registry';

interface HomeProps {
  onNavigate: (appId: string) => void;
}

function AppCard({ app, onNavigate }: { app: AppMeta; onNavigate: (id: string) => void }) {
  const isLive = app.status === 'live';

  return (
    <button
      type="button"
      disabled={!isLive}
      onClick={() => isLive && onNavigate(app.id)}
      className="text-left rounded-2xl border p-5 transition-all duration-200 group w-full"
      style={{
        background: '#071020',
        borderColor: isLive ? 'rgba(8,60,90,0.6)' : 'rgba(8,60,90,0.3)',
        boxShadow: '0 4px 24px rgba(6,182,212,0.04)',
        cursor: isLive ? 'pointer' : 'default',
        opacity: isLive ? 1 : 0.5,
      }}
      onMouseEnter={(e) => {
        if (isLive)
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(34,211,238,0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = isLive
          ? 'rgba(8,60,90,0.6)'
          : 'rgba(8,60,90,0.3)';
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-3xl">{app.icon}</span>
        {app.status === 'soon' && (
          <span
            className="text-xs px-2 py-0.5 rounded-full border shrink-0"
            style={{
              background: 'rgba(100,116,139,0.1)',
              borderColor: 'rgba(100,116,139,0.3)',
              color: '#64748b',
            }}
          >
            Soon
          </span>
        )}
      </div>
      <div
        className="font-black text-base mb-1 group-hover:text-cyan-300 transition-colors"
        style={{ fontFamily: "'Exo 2', sans-serif", color: '#e2e8f0' }}
      >
        {app.name}
      </div>
      <div className="text-xs text-slate-500 leading-relaxed">{app.description}</div>
      {isLive && (
        <div className="mt-4 text-xs text-cyan-500/60 group-hover:text-cyan-400/80 transition-colors flex items-center gap-1">
          Open <span>→</span>
        </div>
      )}
    </button>
  );
}

export function HomePage({ onNavigate }: HomeProps) {
  return (
    <div style={{ animation: 'float-in 0.5s ease both' }}>
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="text-5xl">🌊</span>
          <h1
            className="font-black tracking-tight"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: '3rem',
              background: 'linear-gradient(135deg, #67e8f9 0%, #a5f3fc 40%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
            }}
          >
            ABYSS TOOLS
          </h1>
        </div>
        <p className="text-slate-400 text-sm tracking-widest uppercase mb-2">
          Community tools for Abyss players
        </p>
        <div
          className="h-px w-56 mx-auto"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)',
          }}
        />
      </div>

      {/* App grid */}
      <div>
        <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/50 mb-4">
          Available Tools
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPS.map((app) => (
            <AppCard key={app.id} app={app} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}
