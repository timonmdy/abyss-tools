import { useState, useCallback } from 'react';
import type { GameData, HistoryEntry } from '../types';
import type { TimeUnit } from '../../../shared/types';
import { Dropdown } from '../../../shared/components/Dropdown';
import { AbyssInput } from '../../../shared/components/AbyssInput';
import { Stars } from '../../../shared/components/Stars';
import { Panel, PanelHeading } from '../../../shared/components/Panel';
import { formatValue, scaleToUnit, timeSuffix, formatDuration } from '../../../shared/utils/format';

interface CalculatorProps {
  data: GameData;
  timeUnit: TimeUnit;
  onCalculate: (entry: HistoryEntry) => void;
}

export function Calculator({ data, timeUnit, onCalculate }: CalculatorProps) {
  const defaultFishIdx = String(Math.max(0, data.fish.findIndex((f) => f.data_filled)));

  const [selectedFish,     setSelectedFish]     = useState(defaultFishIdx);
  const [selectedQuality,  setSelectedQuality]  = useState('0');
  const [selectedMutation, setSelectedMutation] = useState('0');
  const [customBase,       setCustomBase]       = useState('100');
  const [customTime,       setCustomTime]       = useState('120');
  const [customQuality,    setCustomQuality]    = useState('1.0');
  const [customMutation,   setCustomMutation]   = useState('1.0');
  const [result,           setResult]           = useState<number | null>(null);
  const [lastEntry,        setLastEntry]        = useState<HistoryEntry | null>(null);
  const [fired,            setFired]            = useState(false);

  const isCustomFish     = selectedFish     === 'custom';
  const isCustomQuality  = selectedQuality  === 'custom';
  const isCustomMutation = selectedMutation === 'custom';

  const currentFish     = isCustomFish     ? null : data.fish[parseInt(selectedFish)];
  const currentQuality  = isCustomQuality  ? null : data.qualities[parseInt(selectedQuality)];
  const currentMutation = isCustomMutation ? null : data.mutations[parseInt(selectedMutation)];

  const fishDataMissing = !isCustomFish && currentFish != null && !currentFish.data_filled;

  const getValues = useCallback(() => {
    const base = isCustomFish     ? (parseFloat(customBase)     || 0) : (currentFish?.base_value   ?? 0);
    const time = isCustomFish     ? (parseFloat(customTime)     || 1) : (currentFish?.time_to_roe  ?? 1);
    const qMul = isCustomQuality  ? (parseFloat(customQuality)  || 1) : (currentQuality?.multiplier  ?? 1);
    const mMul = isCustomMutation ? (parseFloat(customMutation) || 1) : (currentMutation?.multiplier ?? 1);
    return { base, time, qMul, mMul };
  }, [
    isCustomFish, isCustomQuality, isCustomMutation,
    customBase, customTime, customQuality, customMutation,
    currentFish, currentQuality, currentMutation,
  ]);

  const { base, time, qMul, mMul } = getValues();
  // Result stored as per-second; scaled for display by the settings timeUnit
  const previewPerSec = (base * qMul * mMul) / (time || 1);
  const previewDisplay = formatValue(scaleToUnit(previewPerSec, timeUnit));
  const suffix = timeSuffix(timeUnit);

  // Dropdown shows TTR as human-readable duration, not raw seconds
  const fishOptions = [
    ...data.fish.map((f, i) => ({
      value: String(i),
      label: f.data_filled
        ? `${f.fish_name} <span style="color:#64748b;font-size:0.75rem;">(base ${f.base_value}, ${formatDuration(f.time_to_roe)})</span>`
        : `<span style="color:#475569;">${f.fish_name}</span> <span style="color:#374151;font-size:0.75rem;">— no data</span>`,
      disabled: !f.data_filled,
    })),
    { value: 'custom', label: '✏️ Custom Fish', disabled: false },
  ];

  const qualityOptions = [
    ...data.qualities.map((q, i) => ({
      value: String(i),
      label: `${Array.from({ length: 5 }, (_, j) =>
        `<span style="color:${j < q.stars ? '#f97316' : '#374151'}">★</span>`
      ).join('')} <span style="color:#64748b;margin-left:6px;">×${q.multiplier}</span>`,
    })),
    { value: 'custom', label: '✏️ Custom Multiplier' },
  ];

  const mutationOptions = [
    ...data.mutations.map((m, i) => ({
      value: String(i),
      label: `${m.name} <span style="color:#64748b;margin-left:6px;">×${m.multiplier}</span>`,
    })),
    { value: 'custom', label: '✏️ Custom Multiplier' },
  ];

  const handleCalculate = () => {
    if (fishDataMissing) return;
    const { base, time, qMul, mMul } = getValues();
    const perSec = (base * qMul * mMul) / (time || 1);
    setResult(perSec);
    setFired(true);
    setTimeout(() => setFired(false), 600);

    const entry: HistoryEntry = {
      id:            Date.now(),
      timestamp:     Date.now(),
      fishName:      isCustomFish     ? 'Custom Fish' : (currentFish?.fish_name       ?? '?'),
      baseValue:     base,
      timeToRoe:     time,
      qualityStars:  isCustomQuality  ? 0             : (currentQuality?.stars        ?? 0),
      qualityMulti:  qMul,
      mutationName:  isCustomMutation ? 'Custom'      : (currentMutation?.name        ?? '?'),
      mutationMulti: mMul,
      result:        perSec,
    };
    setLastEntry(entry);
    onCalculate(entry);
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4 mb-4" style={{ overflow: 'visible' }}>

        {/* ── Fish Panel ── */}
        <Panel>
          <PanelHeading icon="🐠">Fish Selection</PanelHeading>
          <div className="flex flex-col gap-4">
            <Dropdown label="Fish" icon="🐟" value={selectedFish} options={fishOptions} onChange={setSelectedFish} />

            {fishDataMissing ? (
              <div className="rounded-xl border border-yellow-900/40 bg-yellow-900/10 p-3 text-center">
                <div className="text-lg mb-1">⚠️</div>
                <div className="text-xs font-semibold text-yellow-400/80">Data not available</div>
                <div className="text-xs text-slate-600 mt-0.5">No roe data found for this fish yet.</div>
              </div>
            ) : isCustomFish ? (
              <div className="grid grid-cols-2 gap-3">
                <AbyssInput label="Base Value"      icon="💰" value={customBase} onChange={setCustomBase} min={0} />
                <AbyssInput label="Time to Roe (s)" icon="⏱️" value={customTime} onChange={setCustomTime} min={1} step={1} />
              </div>
            ) : currentFish ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#0a1628]/60 border border-[rgba(8,60,90,0.4)] p-3 text-center">
                  <div className="text-xs text-slate-500 mb-1">Base Value</div>
                  <div className="text-xl font-black" style={{ fontFamily: "'Exo 2', sans-serif", color: '#fbbf24' }}>
                    {currentFish.base_value}
                  </div>
                </div>
                <div className="rounded-xl bg-[#0a1628]/60 border border-[rgba(8,60,90,0.4)] p-3 text-center">
                  <div className="text-xs text-slate-500 mb-1">Time to Roe</div>
                  <div className="text-xl font-black text-cyan-400" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                    {formatDuration(currentFish.time_to_roe)}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Panel>

        {/* ── Modifiers Panel ── */}
        <Panel>
          <PanelHeading icon="✨">Modifiers</PanelHeading>
          <div className="flex flex-col gap-4">
            <Dropdown label="Quality"  icon="⭐" value={selectedQuality}  options={qualityOptions}  onChange={setSelectedQuality} />
            {isCustomQuality && (
              <AbyssInput label="Quality Multiplier"  icon="✨" value={customQuality}  onChange={setCustomQuality}  min={0} />
            )}
            <Dropdown label="Mutation" icon="🧬" value={selectedMutation} options={mutationOptions} onChange={setSelectedMutation} />
            {isCustomMutation && (
              <AbyssInput label="Mutation Multiplier" icon="🧬" value={customMutation} onChange={setCustomMutation} min={0} />
            )}
          </div>
        </Panel>
      </div>

      {/* Formula preview */}
      {!fishDataMissing && (
        <div
          className="rounded-2xl border border-[rgba(8,60,90,0.4)] bg-[#071020]/60 p-4 mb-4 text-center text-sm"
          style={{ animation: 'float-in 0.45s 0.1s ease both', opacity: 0 }}
        >
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>{base}</span>
          <span className="mx-2 text-slate-700">×</span>
          <span style={{ color: '#fde68a', fontWeight: 700 }}>{qMul}</span>
          <span className="mx-2 text-slate-700">×</span>
          <span style={{ color: '#c4b5fd', fontWeight: 700 }}>{mMul}</span>
          <span className="mx-2 text-slate-700">÷</span>
          <span className="text-cyan-400 font-bold">{formatDuration(time)}</span>
          <span className="mx-2 text-slate-700">=</span>
          <span className="text-slate-200 font-bold">{previewDisplay}{suffix}</span>
        </div>
      )}

      {/* Calculate button */}
      <button
        onClick={handleCalculate}
        disabled={fishDataMissing}
        className="w-full py-4 rounded-2xl font-black text-lg tracking-wider uppercase text-white transition-all duration-200"
        style={{
          fontFamily: "'Exo 2', sans-serif",
          background: fishDataMissing ? 'linear-gradient(135deg, #1e293b, #1e293b)' : 'linear-gradient(135deg, #0891b2, #6366f1)',
          boxShadow: fired ? '0 0 40px 8px rgba(34,211,238,0.5)' : '0 0 20px 2px rgba(34,211,238,0.18)',
          opacity: fishDataMissing ? 0.4 : 1,
          cursor: fishDataMissing ? 'not-allowed' : 'pointer',
        }}
      >
        {fishDataMissing ? '⚠️ No Data — Select a Different Fish' : '⚗️ Calculate Pond Value'}
      </button>

      {/* Result */}
      {result !== null && lastEntry && !fishDataMissing && (
        <div
          key={lastEntry.id}
          className="mt-5 rounded-2xl border p-6 text-center"
          style={{
            borderColor: 'rgba(34,211,238,0.25)',
            background: 'linear-gradient(135deg, rgba(8,145,178,0.1), rgba(99,102,241,0.1))',
            boxShadow: '0 0 32px rgba(34,211,238,0.1)',
            animation: 'result-pop 0.35s ease both',
          }}
        >
          <div className="text-xs tracking-widest uppercase text-cyan-400/50 mb-2">
            Roe Value {suffix}
          </div>
          <div
            className="font-black tabular-nums mb-1"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: '3.5rem',
              background: 'linear-gradient(90deg, #22d3ee, #c4b5fd, #22d3ee)',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite',
              lineHeight: 1,
            }}
          >
            {formatValue(scaleToUnit(result, timeUnit))}
          </div>
          <div className="text-slate-500 text-sm mb-4">{suffix}</div>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
              {lastEntry.fishName}
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center gap-1">
              {lastEntry.qualityStars > 0 ? <Stars count={lastEntry.qualityStars} /> : 'Custom'}
              <span className="ml-1">×{lastEntry.qualityMulti}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              {lastEntry.mutationName} ×{lastEntry.mutationMulti}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
