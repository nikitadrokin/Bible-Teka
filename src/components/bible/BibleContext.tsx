import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { BibleBookSelection, BibleBook } from '@/types/bible';
import { padNumber } from '@/lib/utils';
import { bibleBooks } from '@/data/bible';

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
}

const BibleContext = createContext<BibleContextProps | undefined>(undefined);

export function BibleProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<BibleBookSelection>({
    book: bibleBooks[0],
    chapter: 1,
  });

  const handleBookSelect = (value: string) => {
    const selectedBook = bibleBooks.find(
      (book: BibleBook) => book.id === parseInt(value),
    );
    setSelection({
      book: selectedBook ?? null,
      chapter: null,
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

  // Ensure audioData is never undefined, only string | null
  const audioQuery = {
    data: audioData ?? null,
    isLoading,
    isError,
    error,
  };

  return (
    <BibleContext.Provider
      value={{
        selection,
        setSelection,
        audioQuery,
        handleBookSelect,
        handleChapterSelect,
        chapters,
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
