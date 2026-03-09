import { ReactNode } from 'react';
import type { AppMeta } from '../shared/types';

/**
 * Master registry for all Abyss Tools apps.
 * Apps can be added here with their metadata and route component factory.
 */

export interface RegisteredApp extends AppMeta {
  componentFactory: () => ReactNode;
}

// Store for dynamically registered apps
const appRegistry = new Map<string, RegisteredApp>();

/**
 * Register an app with its route component factory.
 * Call this during app initialization to make it available for routing.
 */
export function registerApp(app: RegisteredApp): void {
  appRegistry.set(app.id, app);
}

/**
 * Update an app's component factory (e.g., when props change).
 */
export function updateAppComponentFactory(appId: string, componentFactory: () => ReactNode): void {
  const app = appRegistry.get(appId);
  if (app) {
    app.componentFactory = componentFactory;
  }
}

/**
 * Get all registered apps.
 */
export function getRegisteredApps(): RegisteredApp[] {
  return Array.from(appRegistry.values());
}

/**
 * Get a specific app by ID.
 */
export function getApp(id: string): RegisteredApp | undefined {
  return appRegistry.get(id);
}

/**
 * Get an app component by route path.
 */
export function getAppComponent(path: string): ReactNode | undefined {
  for (const app of appRegistry.values()) {
    if (app.path === path) {
      return app.componentFactory();
    }
  }
  return undefined;
}

/**
 * Master list of all Abyss Tools apps.
 * Add a new entry here to have it appear on the home page.
 * Must also register the component using registerApp().
 */
export const APPS: AppMeta[] = [
  {
    id: 'pond-calculator',
    name: 'Pond Calculator',
    description: 'Calculate roe value per time unit for your pond fish based on quality and mutation.',
    icon: '🐟',
    path: 'pond-calculator',
    status: 'live',
  },
  // Future apps go here:
  // {
  //   id: 'fish-tracker',
  //   name: 'Fish Tracker',
  //   description: 'Track your fish collection and pond composition.',
  //   icon: '🎣',
  //   path: 'fish-tracker',
  //   status: 'soon',
  // },
];
