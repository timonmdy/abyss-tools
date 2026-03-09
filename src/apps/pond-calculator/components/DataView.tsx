import type { GameData } from '../types';

interface DataViewProps {
  data: GameData;
}

export function DataView({ data }: DataViewProps) {
  const filledCount = data.fish.filter((f) => f.data_filled).length;

  return (
    <div className="flex flex-col gap-4">

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '🐟', label: 'Fish Types', value: data.fish.length,     color: '#fbbf24' },
          { icon: '🧬', label: 'Mutations',  value: data.mutations.length, color: '#a78bfa' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[rgba(8,60,90,0.5)] bg-[#071020] p-4 text-center"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black" style={{ fontFamily: "'Exo 2', sans-serif", color: s.color }}>
              {s.value}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fish table — sticky header, scrollable rows */}
      <div className="rounded-2xl border border-[rgba(8,60,90,0.5)] bg-[#071020]">

        {/* Header */}
        <div className="px-4 pt-4 pb-2 border-b border-[rgba(8,60,90,0.4)]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/60">
              🐟 Fish
            </div>
            <div className="text-xs text-slate-600">
              <span className="text-green-500/70">{filledCount}</span>
              <span className="mx-1">/</span>
              <span>{data.fish.length}</span>
              <span className="ml-1">with data</span>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="pb-2 pr-4 text-xs tracking-widest uppercase text-slate-500 font-semibold">Name</th>
                <th className="pb-2 pr-4 text-xs tracking-widest uppercase text-slate-500 font-semibold">Base Value</th>
                <th className="pb-2 text-xs tracking-widest uppercase text-slate-500 font-semibold">Roe Time</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable rows */}
        <div className="overflow-y-auto" style={{ maxHeight: '260px' }}>
          <table className="w-full text-sm">
            <tbody>
              {data.fish.map((f) => (
                <tr
                  key={f.fish_name}
                  className="border-b border-[rgba(8,60,90,0.3)] transition-colors"
                  style={{ opacity: f.data_filled ? 1 : 0.45 }}
                >
                  <td className="py-2 pl-4 pr-4">
                    <span className={f.data_filled ? 'text-slate-200 font-medium' : 'text-slate-600'}>
                      {f.fish_name}
                    </span>
                    {!f.data_filled && (
                      <span className="ml-2 text-xs text-yellow-900/80 border border-yellow-900/30 bg-yellow-900/10 rounded px-1 py-0.5">
                        no data
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {f.data_filled ? (
                      <span className="font-bold" style={{ fontFamily: "'Exo 2', sans-serif", color: '#fbbf24' }}>
                        {f.base_value}
                      </span>
                    ) : (
                      <span className="text-slate-700">—</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {f.data_filled ? (
                      <span className="text-cyan-400">{f.time_to_roe}s</span>
                    ) : (
                      <span className="text-slate-700">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Qualities */}
      <div className="rounded-2xl border border-[rgba(8,60,90,0.5)] bg-[#071020] p-4">
        <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/60 mb-3">
          ⭐ Qualities
        </div>
        <div className="flex flex-wrap gap-2">
          {data.qualities.map((q) => (
            <div key={q.stars} className="px-3 py-2 rounded-lg border border-orange-900/30 bg-orange-900/10 text-sm">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < q.stars ? '#f97316' : '#374151' }}>★</span>
              ))}
              <span className="text-slate-500 ml-2 text-xs">×{q.multiplier}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mutations */}
      <div className="rounded-2xl border border-[rgba(8,60,90,0.5)] bg-[#071020] p-4">
        <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/60 mb-3">
          🧬 Mutations
        </div>
        <div className="flex flex-wrap gap-2">
          {data.mutations.map((m) => (
            <div key={m.name} className="px-3 py-1.5 rounded-lg border border-purple-900/35 bg-purple-900/10 text-sm">
              <span className="text-purple-300 font-medium">{m.name}</span>
              <span className="text-slate-500 ml-2 text-xs">×{m.multiplier}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
