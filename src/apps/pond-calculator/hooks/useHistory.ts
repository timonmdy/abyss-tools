import { useState, useCallback } from 'react';
import type { HistoryEntry } from '../types';

const STORAGE_KEY = 'abyss_pond_history_v2';

function loadFromStorage(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage unavailable — silent fail
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadFromStorage);

  const addEntry = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveToStorage([]);
  }, []);

  const deleteEntry = useCallback((id: number) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  return { history, addEntry, clearHistory, deleteEntry };
}
