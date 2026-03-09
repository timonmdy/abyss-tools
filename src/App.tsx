import { useLayoutEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomePage } from './HomePage';
import { PondCalculatorApp } from './apps/pond-calculator/PondCalculatorApp';
import { APPS, getRegisteredApps, registerApp, updateAppComponentFactory } from './apps/registry';
import { AppShell } from './shared/components/AppShell';
import { SettingsModal } from './shared/components/SettingsModal';
import { usePageTitle } from './shared/hooks/usePageTitle';
import { useSettings } from './shared/hooks/useSettings';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [appsReady, setAppsReady] = useState(false);
  const { settings, updateSetting } = useSettings();

  // Register all apps synchronously before rendering (useLayoutEffect runs before paint)
  useLayoutEffect(() => {
    // Register Pond Calculator
    const pondCalculatorApp = APPS.find((app) => app.id === 'pond-calculator');
    if (pondCalculatorApp) {
      const componentFactory = () => <PondCalculatorApp settings={settings} />;
      
      if (!getRegisteredApps().find((a) => a.id === 'pond-calculator')) {
        registerApp({
          ...pondCalculatorApp,
          componentFactory,
        });
      } else {
        // Update component factory when settings change
        updateAppComponentFactory('pond-calculator', componentFactory);
      }
    }
    setAppsReady(true);
  }, [settings]);

  // Extract route from location (HashRouter gives us pathname as the hash portion)
  const currentPath = useMemo(() => {
    const pathname = location.pathname.slice(1); // Remove leading '/'
    return pathname || 'home';
  }, [location.pathname]);

  const registeredApps = getRegisteredApps();
  const currentApp = useMemo(() => {
    return registeredApps.find((app) => app.path === currentPath);
  }, [registeredApps, currentPath, appsReady]);

  // Update browser tab title whenever the route changes
  usePageTitle(currentPath === 'home' ? null : currentApp?.name);

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
    currentPath === 'home'
      ? [{ label: 'Abyss Tools' }]
      : currentApp
        ? [
            { label: 'Abyss Tools', onClick: () => navigate('/') },
            { label: currentApp.name },
          ]
        : [{ label: 'Abyss Tools' }];

  return (
    <>
      <AppShell
        breadcrumbs={breadcrumbs}
        actions={settingsBtn}
        backgroundEffects={settings.backgroundEffects}
      >
        {currentPath === 'home' && (
          <HomePage
            onNavigate={(id) => {
              const app = APPS.find((a) => a.id === id);
              if (app) {
                navigate(`/${app.path}`);
              }
            }}
          />
        )}
        {currentApp && currentApp.componentFactory()}
      </AppShell>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSetting}
          onClose={() => setShowSettings(false)}
          initialTab={currentApp?.id || 'general'}
        />
      )}
    </>
  );
}
