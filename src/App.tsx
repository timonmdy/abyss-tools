import { useState } from 'react';
import { AppShell } from './shared/components/AppShell';
import { SettingsModal } from './shared/components/SettingsModal';
import { useSettings } from './shared/hooks/useSettings';
import { usePageTitle } from './shared/hooks/usePageTitle';
import { HomePage } from './HomePage';
import { PondCalculatorApp } from './apps/pond-calculator/PondCalculatorApp';

type AppRoute = 'home' | 'pond-calculator';

// Maps each route to the settings sidebar tab that's most relevant to it.
// 'general' is the fallback for the home page.
const ROUTE_SETTINGS_TAB: Record<AppRoute, string> = {
  'home':             'general',
  'pond-calculator':  'pond-calculator',
};

const ROUTE_LABEL: Record<AppRoute, string> = {
  'home':            'Home',
  'pond-calculator': 'Pond Calculator',
};

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSetting } = useSettings();

  // Update browser tab title whenever the route changes
  usePageTitle(route === 'home' ? null : ROUTE_LABEL[route]);

  const settingsBtn = (
    <button
      onClick={() => setShowSettings(true)}
      title="Settings"
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-[rgba(8,60,90,0.5)]
        bg-[#0a1628]/60 text-slate-500 hover:text-cyan-400 hover:border-cyan-900/60
        transition-all duration-200 text-base"
    >
      ⚙️
    </button>
  );

  const breadcrumbs =
    route === 'home'
      ? [{ label: 'Abyss Tools' }]
      : [
          { label: 'Abyss Tools', onClick: () => setRoute('home') },
          { label: ROUTE_LABEL[route] },
        ];

  return (
    <>
      <AppShell
        breadcrumbs={breadcrumbs}
        actions={settingsBtn}
        backgroundEffects={settings.backgroundEffects}
      >
        {route === 'home' && <HomePage onNavigate={(id) => setRoute(id as AppRoute)} />}
        {route === 'pond-calculator' && <PondCalculatorApp settings={settings} />}
      </AppShell>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSetting}
          onClose={() => setShowSettings(false)}
          initialTab={ROUTE_SETTINGS_TAB[route]}
        />
      )}
    </>
  );
}
