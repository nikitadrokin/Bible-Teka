import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { BibleBookSelection, BibleBook } from '@/types/bible';
import { padNumber } from '@/lib/utils';
import { bibleBooksEnglish, bibleBooksRussian } from '@/data/bible';
import { useLocaleStore } from '@/store/locale-store';
import { useHistoryStore } from '@/store/history-store';

interface BibleContextProps {
  selection: BibleBookSelection;
  setSelection: React.Dispatch<React.SetStateAction<BibleBookSelection>>;
  audioQuery: {
    data: string | null;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
  };
  handleBookSelect: (value: string) => void;
  handleChapterSelect: (value: string) => void;
  chapters: number[];
  advanceToNextChapter: () => void;
  advanceToNextBook: () => void;
  history: BibleBookSelection[];
}

const BibleContext = createContext<BibleContextProps | undefined>(undefined);

export function BibleProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocaleStore();
  const books = locale === 'en' ? bibleBooksEnglish : bibleBooksRussian;
  const { history, lastListenedChapter, addToHistory, setLastListenedChapter } =
    useHistoryStore();

  // Initialize with default selection (will be updated after hydration)
  const [selection, setSelection] = useState<BibleBookSelection>(() => ({
    book: lastListenedChapter?.bookId
      ? books[lastListenedChapter.bookId]
      : null,
    chapter: lastListenedChapter?.chapter || 1,
  }));

  // Track if we've initialized from last listened chapter

  // Initialize with last listened chapter after both stores have hydrated
  useEffect(() => {
    const historyHasHydrated = useHistoryStore.persist.hasHydrated();
    const localeHasHydrated = useLocaleStore.persist.hasHydrated();

    if (historyHasHydrated && localeHasHydrated) {
      if (
        lastListenedChapter &&
        typeof lastListenedChapter.bookId === 'number' &&
        lastListenedChapter.chapter
      ) {
        // Find the book in the current locale using the stored book ID
        const bookInCurrentLocale = books.find(
          (book) => book.id === lastListenedChapter.bookId,
        );
        if (bookInCurrentLocale) {
          setSelection({
            book: bookInCurrentLocale,
            chapter: lastListenedChapter.chapter,
          });
        }
      }
    }
  }, [lastListenedChapter, books]);

  // Update book when locale changes while maintaining the same book ID
  useEffect(() => {
    if (selection.book) {
      const currentBookId = selection.book.id;
      const bookInNewLocale = books.find((book) => book.id === currentBookId);
      if (bookInNewLocale) {
        setSelection((prev) => ({
          ...prev,
          book: bookInNewLocale,
        }));
      }
    }
  }, [locale, books]);

  // Add to history and update last listened when selection changes (only after both stores hydrated)
  useEffect(() => {
    const historyHasHydrated = useHistoryStore.persist.hasHydrated();
    const localeHasHydrated = useLocaleStore.persist.hasHydrated();

    if (
      historyHasHydrated &&
      localeHasHydrated &&
      selection.book &&
      selection.chapter
    ) {
      addToHistory(selection);
      setLastListenedChapter(selection);
    }
  }, [
    selection.book?.id,
    selection.chapter,
    addToHistory,
    setLastListenedChapter,
  ]);

  const handleBookSelect = (value: string) => {
    const selectedBook = books.find(
      (book: BibleBook) => book.id === parseInt(value),
    );
    // Always set chapter to 1 when a book is selected
    setSelection({
      book: selectedBook ?? null,
      chapter: selectedBook ? 1 : null,
    });
  };

  const handleChapterSelect = (value: string) => {
    setSelection((prev) => ({
      ...prev,
      chapter: parseInt(value),
    }));
  };

  const chapters = selection.book
    ? Array.from({ length: selection.book.chapters }, (_, i) => i + 1)
    : [];

  // Advance to the next chapter or next book's first chapter
  const advanceToNextChapter = useCallback(() => {
    if (!selection.book || !selection.chapter) return;

    // If current chapter is not the last one in the book
    if (selection.chapter < selection.book.chapters) {
      // Go to next chapter
      setSelection((prev) => ({
        ...prev,
        chapter: (prev.chapter || 0) + 1,
      }));
    } else {
      // Go to first chapter of next book
      advanceToNextBook();
    }
  }, [selection.book, selection.chapter]);

  // Advance to the next book, starting from chapter 1
  const advanceToNextBook = useCallback(() => {
    if (!selection.book) return;

    // If not the last book
    if (selection.book.id < books.length - 1) {
      const nextBook = books.find((book) => book.id === selection.book!.id + 1);
      if (nextBook) {
        setSelection({
          book: nextBook,
          chapter: 1,
        });
      }
    } else {
      // If it's the last book, loop back to the first book
      setSelection({
        book: books[0],
        chapter: 1,
      });
    }
  }, [selection.book]);

  const {
    data: audioData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['audioUrl', selection.book?.id, selection.chapter],
    queryFn: async () => {
      if (!selection.book || !selection.chapter) return null;

      const bookNum = padNumber(selection.book.id + 1); // Add 1 because our IDs start at 0
      const chapterNum = padNumber(selection.chapter);
      // Use the API route for audio
      const url = `/api/audio/${bookNum}/${chapterNum}.mp3`;

      try {
        // Check if the audio file exists through our API route
        const response = await fetch(url, {
          method: 'GET',
        });

        if (!response.ok) {
          console.error('Audio file not found:', url, response.status);
          throw new Error(`Audio file not found (${response.status})`);
        }

        // If the request succeeds, return the URL for the audio player
        return url;
      } catch (err) {
        console.error('Error fetching audio:', err);
        throw new Error('Failed to load audio file');
      }
    },
    enabled: !!selection.book && !!selection.chapter,
    retry: 1, // Only retry once
  });

  // Handle audio fetch errors by advancing to the next book
  useEffect(() => {
    if (isError && selection.book && selection.chapter) {
      console.log('Error fetching audio, advancing to next book');
      // Use a small delay to prevent immediate re-render issues
      const timeoutId = setTimeout(() => {
        advanceToNextBook();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isError, selection.book, selection.chapter, advanceToNextBook]);

  // Ensure audioData is never undefined, only string | null
  const audioQuery = {
    data: audioData ?? null,
    isLoading,
    isError,
    error,
  };

  // Format history for the context - convert book IDs back to book objects
  const formattedHistory = history.map((entry) => {
    const book = books.find((b) => b.id === entry.bookId);
    return {
      book: book || null,
      chapter: entry.chapter,
    };
  });

  return (
    <BibleContext.Provider
      value={{
        selection,
        setSelection,
        audioQuery,
        handleBookSelect,
        handleChapterSelect,
        chapters,
        advanceToNextChapter,
        advanceToNextBook,
        history: formattedHistory,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
}
