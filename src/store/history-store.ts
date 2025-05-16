import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BibleBookSelection } from '@/types/bible';

export type HistoryEntry = BibleBookSelection & {
  timestamp: number;
};

interface HistoryStore {
  history: HistoryEntry[];
  addToHistory: (selection: BibleBookSelection) => void;
  clearHistory: () => void;
}

const MAX_HISTORY_ITEMS = 20;

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (selection) => {
        if (!selection.book || !selection.chapter) return;

        set((state) => {
          // Create a new history entry with timestamp
          const newEntry: HistoryEntry = {
            ...selection,
            timestamp: Date.now(),
          };

          // Filter out any existing entries with the same book and chapter
          const filteredHistory = state.history.filter(
            (entry) =>
              entry.book?.id !== selection.book?.id ||
              entry.chapter !== selection.chapter,
          );

          // Add new entry at the beginning and limit to MAX_HISTORY_ITEMS
          return {
            history: [newEntry, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS),
          };
        });
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'bible-teka-reading-history',
    },
  ),
);
