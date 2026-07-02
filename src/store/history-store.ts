import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BibleBookSelection } from '@/types/bible';

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
        if (
          !useHistoryStore.persist.hasHydrated() ||
          !selection.book ||
          !selection.chapter
        )
          return;

        set((state) => {
          const newEntry: HistoryEntry = {
            locale: 'ru',
            bookId: selection.book!.id,
            chapter: selection.chapter!,
            timestamp: Date.now(),
          };

          const filteredHistory = state.history.filter(
            (entry) =>
              entry.bookId !== selection.book?.id ||
              entry.chapter !== selection.chapter,
          );

          return {
            history: [newEntry, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS),
          };
        });
      },
      setLastListenedChapter: (selection) => {
        if (
          !useHistoryStore.persist.hasHydrated() ||
          !selection.book ||
          !selection.chapter
        )
          return;

        set({
          lastListenedChapter: {
            locale: 'ru',
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
