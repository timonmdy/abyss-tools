import type { GameData } from '../types';

interface DataViewProps {
  data: GameData;
}

export function DataView({ data }: DataViewProps) {
  return (
    <div
      className="rounded-2xl border border-[rgba(8,60,90,0.4)] flex flex-col"
      style={{
        background: '#071020',
        maxHeight: 'calc(100vh - 280px)',
        minHeight: '200px',
      }}
    >
      {/* Sticky summary bar */}
      <div
        className="shrink-0 grid grid-cols-2 gap-3 p-4 border-b border-[rgba(8,60,90,0.4)]"
      >
        {[
          { icon: '🐟', label: 'Fish Types', value: data.fish.length,     color: '#fbbf24' },
          { icon: '🧬', label: 'Mutations',  value: data.mutations.length, color: '#a78bfa' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[rgba(8,60,90,0.5)] bg-[#0a1628]/60 p-3 text-center"
          >
            <div className="text-xl mb-0.5">{s.icon}</div>
            <div
              className="text-xl font-black"
              style={{ fontFamily: "'Exo 2', sans-serif", color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto flex-1">
        <div className="p-4 flex flex-col gap-4">

          {/* Fish table */}
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/60 mb-3">
              🐟 Fish
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[rgba(8,60,90,0.5)]">
                  <th className="pb-2 pr-4 text-xs tracking-widest uppercase text-slate-500 font-semibold">Name</th>
                  <th className="pb-2 pr-4 text-xs tracking-widest uppercase text-slate-500 font-semibold">Base Value</th>
                  <th className="pb-2 text-xs tracking-widest uppercase text-slate-500 font-semibold">Roe Time</th>
                </tr>
              </thead>
              <tbody>
                {data.fish.map((f) => (
                  <tr
                    key={f.fish_name}
                    className="border-b border-[rgba(8,60,90,0.3)] hover:bg-cyan-900/5 transition-colors"
                  >
                    <td className="py-2 pr-4 text-slate-200 font-medium">{f.fish_name}</td>
                    <td
                      className="py-2 pr-4 font-bold"
                      style={{ fontFamily: "'Exo 2', sans-serif", color: '#fbbf24' }}
                    >
                      {f.base_value}
                    </td>
                    <td className="py-2 text-cyan-400">{f.time_to_roe}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Divider */}
          <div className="border-t border-[rgba(8,60,90,0.4)]" />

          {/* Qualities */}
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/60 mb-3">
              ⭐ Qualities
            </div>
            <div className="flex flex-wrap gap-2">
              {data.qualities.map((q) => (
                <div
                  key={q.stars}
                  className="px-3 py-2 rounded-lg border border-orange-900/30 bg-orange-900/10 text-sm"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: i < q.stars ? '#f97316' : '#374151' }}>★</span>
                  ))}
                  <span className="text-slate-500 ml-2 text-xs">×{q.multiplier}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[rgba(8,60,90,0.4)]" />

          {/* Mutations */}
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/60 mb-3">
              🧬 Mutations
            </div>
            <div className="flex flex-wrap gap-2">
              {data.mutations.map((m) => (
                <div
                  key={m.name}
                  className="px-3 py-1.5 rounded-lg border border-purple-900/35 bg-purple-900/10 text-sm"
                >
                  <span className="text-purple-300 font-medium">{m.name}</span>
                  <span className="text-slate-500 ml-2 text-xs">×{m.multiplier}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
