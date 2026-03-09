import type { AppMeta } from '../shared/types';

/**
 * Master list of all Abyss Tools apps.
 * Add a new entry here to have it appear on the home page.
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
