export interface Fish {
  fish_name: string;
  time_to_roe: number;
  base_value: number;
}

export interface Quality {
  stars: number;
  multiplier: number;
}

export interface Mutation {
  name: string;
  multiplier: number;
}

export interface GameData {
  fish: Fish[];
  qualities: Quality[];
  mutations: Mutation[];
}

export interface HistoryEntry {
  id: number;
  timestamp: number;
  fishName: string;
  baseValue: number;
  timeToRoe: number;
  qualityStars: number;
  qualityMulti: number;
  mutationName: string;
  mutationMulti: number;
  result: number; // always stored as per-hour; display scaled by settings
}

export type TabId = 'calculator' | 'history' | 'data';
