import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BibleBookSelection } from '@/types/bible';
import { useLocaleStore } from './locale-store';

export type HistoryEntry = {
  locale: string;
  bookId: number;
  chapter: number;
  timestamp: number;
};

export type LastListenedChapter = {
  locale: string;
  bookId: number;
  chapter: number;
};

interface HistoryStore {
  history: HistoryEntry[];
  lastListenedChapter: LastListenedChapter | null;
  addToHistory: (selection: BibleBookSelection) => void;
  setLastListenedChapter: (selection: BibleBookSelection) => void;
  clearHistory: () => void;
}

const MAX_HISTORY_ITEMS = 20;

const isDev = import.meta.env.DEV;

const history = isDev
  ? (Array.from({ length: 20 }, (_, i) => ({
      locale: 'ru',
      bookId: i,
      chapter: i + 1,
      timestamp: Date.now(),
    })) satisfies HistoryEntry[])
  : [];

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history,
      lastListenedChapter: get()?.history[0] || null,
      addToHistory: (selection) => {
        // Only add to history if both stores have hydrated and selection is valid
        if (
          !useHistoryStore.persist.hasHydrated() ||
          !useLocaleStore.persist.hasHydrated() ||
          !selection.book ||
          !selection.chapter
        )
          return;

        const locale = useLocaleStore.getState().locale;

        set((state) => {
          // Create a new history entry with timestamp
          const newEntry: HistoryEntry = {
            locale,
            bookId: selection.book!.id,
            chapter: selection.chapter!,
            timestamp: Date.now(),
          };

          // Filter out any existing entries with the same book and chapter
          const filteredHistory = state.history.filter(
            (entry) =>
              entry.bookId !== selection.book?.id ||
              entry.chapter !== selection.chapter,
          );

          // Add new entry at the beginning and limit to MAX_HISTORY_ITEMS
          return {
            history: [newEntry, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS),
          };
        });
      },
      setLastListenedChapter: (selection) => {
        // Only update if both stores have hydrated and selection is valid
        if (
          !useHistoryStore.persist.hasHydrated() ||
          !useLocaleStore.persist.hasHydrated() ||
          !selection.book ||
          !selection.chapter
        )
          return;

        const locale = useLocaleStore.getState().locale;

        set({
          lastListenedChapter: {
            locale,
            bookId: selection.book.id,
            chapter: selection.chapter,
          },
        });
      },
      clearHistory: () => set({ history: [], lastListenedChapter: null }),
    }),
    {
      name: 'bible-teka-reading-history',
    },
  ),
);
