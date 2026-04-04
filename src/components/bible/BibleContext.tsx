import {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import type { BibleBookSelection, BibleBook } from '@/types/bible';
import { bibleBooksEnglish, bibleBooksRussian } from '@/data/bible';
import { useLocaleStore } from '@/store/locale-store';
import { useHistoryStore } from '@/store/history-store';
import {
  getAudioUrlForSelection,
  getNextBibleSelection,
} from '@/lib/audio';
import { bookIdToSlug, slugToBookId } from '@/lib/book-slugs';

interface BibleContextProps {
  selection: BibleBookSelection;
  setSelection: (value: BibleBookSelection) => void;
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
  nextAudioUrl: string | null;
  prefetchNextChapter: () => Promise<void>;
  history: BibleBookSelection[];
}

const BibleContext = createContext<BibleContextProps | undefined>(undefined);

const AUDIO_URL_QUERY_STALE_TIME = 5 * 60 * 1000;

async function resolveAudioUrl(
  book: BibleBook | null,
  chapter: number | null,
): Promise<string | null> {
  if (!book || !chapter) return null;

  const url = getAudioUrlForSelection({ book, chapter });
  if (!url) return null;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Audio file not found:', url, response.status);
      throw new Error(`Audio file not found (${response.status})`);
    }

    return url;
  } catch (err) {
    console.error('Error fetching audio:', err);
    throw new Error('Failed to load audio file');
  }
}

export function BibleProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocaleStore();
  const books = locale === 'en' ? bibleBooksEnglish : bibleBooksRussian;
  const queryClient = useQueryClient();
  const { history, lastListenedChapter, addToHistory, setLastListenedChapter } =
    useHistoryStore();

  // URL query params: ?book=genesis&chapter=1
  const [{ book: bookSlug, chapter }, setParams] = useQueryStates({
    book: parseAsString,
    chapter: parseAsInteger,
  });

  // Derive the book object from the slug in the URL
  const bookId = bookSlug !== null ? slugToBookId(bookSlug) : null;
  const book = bookId !== null ? (books.find((b) => b.id === bookId) ?? null) : null;
  const selection: BibleBookSelection = { book, chapter };

  // Initialize URL params from lastListenedChapter when no URL params are present
  useEffect(() => {
    if (bookSlug !== null) return; // URL already has a book, don't overwrite

    const historyHasHydrated = useHistoryStore.persist.hasHydrated();
    const localeHasHydrated = useLocaleStore.persist.hasHydrated();

    if (
      historyHasHydrated &&
      localeHasHydrated &&
      lastListenedChapter &&
      typeof lastListenedChapter.bookId === 'number' &&
      lastListenedChapter.chapter
    ) {
      const slug = bookIdToSlug(lastListenedChapter.bookId);
      if (slug) {
        setParams({ book: slug, chapter: lastListenedChapter.chapter });
      }
    }
  }, [lastListenedChapter]);

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

  // Convenience setter: accepts a BibleBookSelection and updates URL params
  const setSelection = useCallback(
    (value: BibleBookSelection) => {
      const slug = value.book ? bookIdToSlug(value.book.id) : null;
      setParams({ book: slug, chapter: value.chapter });
    },
    [setParams],
  );

  const handleBookSelect = (value: string) => {
    const selectedBookId = parseInt(value);
    const slug = bookIdToSlug(selectedBookId);
    setParams({ book: slug, chapter: 1 });
  };

  const handleChapterSelect = (value: string) => {
    setParams({ chapter: parseInt(value) });
  };

  const chapters = book
    ? Array.from({ length: book.chapters }, (_, i) => i + 1)
    : [];

  const nextSelection = getNextBibleSelection(selection, books);
  const nextAudioUrl = nextSelection
    ? getAudioUrlForSelection(nextSelection)
    : null;

  // Advance to the next chapter or next book's first chapter
  const advanceToNextChapter = useCallback(() => {
    if (!book || !chapter) return;

    if (chapter < book.chapters) {
      setParams({ chapter: chapter + 1 });
    } else {
      advanceToNextBook();
    }
  }, [book, chapter, setParams]);

  // Advance to the next book, starting from chapter 1
  const advanceToNextBook = useCallback(() => {
    if (!book) return;

    if (book.id < books.length - 1) {
      const nextBook = books.find((b) => b.id === book.id + 1);
      if (nextBook) {
        const slug = bookIdToSlug(nextBook.id);
        setParams({ book: slug, chapter: 1 });
      }
    } else {
      // Last book: loop back to the first book
      const slug = bookIdToSlug(books[0].id);
      setParams({ book: slug, chapter: 1 });
    }
  }, [book, books, setParams]);

  const {
    data: audioData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['audioUrl', book?.id, chapter],
    queryFn: () => resolveAudioUrl(book, chapter),
    enabled: !!book && !!chapter,
    retry: 1,
    staleTime: AUDIO_URL_QUERY_STALE_TIME,
  });

  const prefetchNextChapter = useCallback(async () => {
    if (!nextSelection?.book || !nextSelection.chapter) return;

    await queryClient.prefetchQuery({
      queryKey: ['audioUrl', nextSelection.book.id, nextSelection.chapter],
      queryFn: () => resolveAudioUrl(nextSelection.book, nextSelection.chapter),
      staleTime: AUDIO_URL_QUERY_STALE_TIME,
    });
  }, [nextSelection?.book?.id, nextSelection?.chapter, queryClient]);

  // Handle audio fetch errors by advancing to the next book
  useEffect(() => {
    if (isError && book && chapter) {
      console.log('Error fetching audio, advancing to next book');
      const timeoutId = setTimeout(() => {
        advanceToNextBook();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isError, book, chapter, advanceToNextBook]);

  const audioQuery = {
    data: audioData ?? null,
    isLoading,
    isError,
    error,
  };

  // Format history for the context - convert book IDs back to book objects
  const formattedHistory = history.map((entry) => {
    const historyBook = books.find((b) => b.id === entry.bookId);
    return {
      book: historyBook || null,
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
        nextAudioUrl,
        prefetchNextChapter,
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
