import { useEffect } from 'react';

const BASE = 'Abyss Tools';

/**
 * Sets the browser tab title.
 * Pass undefined or null to reset to just "Abyss Tools".
 *
 * Usage:
 *   usePageTitle('Pond Calculator')  →  "Pond Calculator · Abyss Tools"
 *   usePageTitle()                   →  "Abyss Tools"
 */
export function usePageTitle(appName?: string | null) {
  useEffect(() => {
    document.title = appName ? `${appName} · ${BASE}` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [appName]);
}
