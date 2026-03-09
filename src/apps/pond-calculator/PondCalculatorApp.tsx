import { useState } from 'react';
import type { TabId, GameData } from './types';
import type { AppSettings } from '../../shared/types';
import { Calculator } from './components/Calculator';
import { History } from './components/History';
import { DataView } from './components/DataView';
import { useHistory } from './hooks/useHistory';
import fishData from './config/fish.json';
import qualitiesData from './config/qualities.json';
import mutationsData from './config/mutations.json';

const gameData: GameData = {
  fish: fishData,
  qualities: qualitiesData,
  mutations: mutationsData,
};

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'calculator', icon: '⚗️', label: 'Calculator' },
  { id: 'history',    icon: '📜', label: 'History'    },
  { id: 'data',       icon: '🗄️', label: 'Data'       },
];

interface PondCalculatorAppProps {
  settings: AppSettings;
}

export function PondCalculatorApp({ settings }: PondCalculatorAppProps) {
  const [activeTab, setActiveTab] = useState<TabId>('calculator');
  const { history, addEntry, clearHistory, deleteEntry } = useHistory();

  return (
    // Full-height flex column — the tab content area will fill whatever is left
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 56px - 80px)' }}>

      {/* Page heading */}
      <div className="text-center mb-8 shrink-0" style={{ animation: 'float-in 0.5s ease both' }}>
        <div className="inline-flex items-center gap-3 mb-2">
          <span className="text-3xl">🐟</span>
          <h1
            className="font-black tracking-tight"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: '2rem',
              background: 'linear-gradient(135deg, #67e8f9 0%, #a5f3fc 40%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
            }}
          >
            Pond Calculator
          </h1>
        </div>
        <p className="text-slate-500 text-xs tracking-widest uppercase">Roe Value Calculator</p>
        <div
          className="mt-2 h-px w-40 mx-auto"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)' }}
        />
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-2 mb-4 bg-[#0a1628]/60 p-1 rounded-2xl border border-[rgba(8,60,90,0.4)] w-fit mx-auto shrink-0"
        style={{ animation: 'float-in 0.5s 0.08s ease both', opacity: 0 }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase
              transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/35'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            <span>{tab.icon}</span>
            {tab.id === 'history' ? `${tab.label} (${history.length})` : tab.label}
          </button>
        ))}
      </div>

      {/*
        Tab content wrapper.
        - Calculator: grows naturally (no max-height, no scroll — it's a form)
        - History / Data: capped at 100vh minus header/heading/tabs, then scroll inside
      */}
      <div
        className="flex-1"
        style={{ animation: 'float-in 0.4s ease both', minHeight: 0 }}
      >
        {activeTab === 'calculator' && (
          <Calculator data={gameData} timeUnit={settings.timeUnit} onCalculate={addEntry} />
        )}
        {activeTab === 'history' && (
          <History
            history={history}
            timeUnit={settings.timeUnit}
            onClear={clearHistory}
            onDelete={deleteEntry}
          />
        )}
        {activeTab === 'data' && <DataView data={gameData} />}
      </div>
    </div>
  );
}
