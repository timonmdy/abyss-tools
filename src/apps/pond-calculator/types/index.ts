export interface Fish {
  fish_name: string;
  time_to_roe: number;
  base_value: number;
  data_filled: boolean;
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
  result: number; // stored as per-second
}

export type TabId = 'calculator' | 'history' | 'data';
