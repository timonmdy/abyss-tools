import type { HistoryEntry } from '../types';
import { Stars } from '../../../shared/components/Stars';
import { autoFormatValue } from '../../../shared/utils/format';

interface HistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onDelete: (id: number) => void;
}

function HistoryCard({
  entry,
  index,
  onDelete,
}: {
  entry: HistoryEntry;
  index: number;
  onDelete: () => void;
}) {
  const { display, suffix } = autoFormatValue(entry.result);

  return (
    <div
      className="rounded-xl border border-[rgba(8,60,90,0.5)] bg-[#071020]/75 p-4
        hover:border-cyan-900/60 transition-all duration-200 group"
      style={{ animation: `float-in 0.3s ${index * 0.04}s ease both`, opacity: 0 }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-bold text-cyan-300 text-sm truncate">{entry.fishName}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="font-black text-lg tabular-nums"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {display}
            <span className="text-xs ml-1 font-normal" style={{ WebkitTextFillColor: '#64748b', fontFamily: 'inherit' }}>
              {suffix}
            </span>
          </span>
          <button
            onClick={onDelete}
            title="Remove entry"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150
              w-6 h-6 flex items-center justify-center rounded-md
              text-slate-600 hover:text-red-400 hover:bg-red-900/20 text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        <span>Base <strong className="text-slate-300">{entry.baseValue}</strong></span>
        <span className="flex items-center gap-1">
          Quality{' '}
          {entry.qualityStars > 0 ? <Stars count={entry.qualityStars} /> : 'Custom'}{' '}
          <strong className="text-slate-300">×{entry.qualityMulti}</strong>
        </span>
        <span>
          Mutation <strong className="text-cyan-400">{entry.mutationName}</strong>{' '}
          ×{entry.mutationMulti}
        </span>
        <span>TTR <strong className="text-slate-300">{entry.timeToRoe}s</strong></span>
      </div>

      <div className="mt-2 text-xs text-slate-700">
        {new Date(entry.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

export function History({ history, onClear, onDelete }: HistoryProps) {
  return (
    <div
      className="rounded-2xl border border-[rgba(8,60,90,0.4)] flex flex-col"
      style={{ background: '#071020', maxHeight: 'calc(100vh - 280px)', minHeight: '200px' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(8,60,90,0.4)] shrink-0">
        <div className="text-xs font-bold tracking-widest uppercase text-cyan-400/60">
          Calculation History
          {history.length > 0 && (
            <span className="ml-2 text-slate-600 normal-case tracking-normal font-normal">
              ({history.length})
            </span>
          )}
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-red-400/50 hover:text-red-400 transition-colors
              px-3 py-1 rounded-lg border border-red-900/30 hover:border-red-800/50"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {history.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <div className="text-5xl mb-4">📜</div>
            <p className="text-sm">No calculations yet.<br />Head to the calculator to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4">
            {history.map((entry, i) => (
              <HistoryCard key={entry.id} entry={entry} index={i} onDelete={() => onDelete(entry.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
