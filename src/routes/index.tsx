import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { bibleBooks } from '@/data/bible';
import type { BibleBookSelection } from '@/types/bible';
import { padNumber } from '@/lib/utils';
import { AudioPlayer } from '@/components/ui/audio-player';

export const Route = createFileRoute('/')({
  component: BibleSelector,
});

function BibleSelector() {
  const [selection, setSelection] = useState<BibleBookSelection>({
    book: null,
    chapter: null,
  });

  const {
    data: audioUrl,
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

  const handleBookSelect = (value: string) => {
    const selectedBook = bibleBooks.find((book) => book.id === parseInt(value));
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

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='mx-auto max-w-lg space-y-8'>
        <h1 className='text-3xl font-bold text-center text-foreground'>
          Bible Navigator
        </h1>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Select a Book
            </label>
            <Select
              onValueChange={handleBookSelect}
              value={selection.book?.id.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder='Choose a book' />
              </SelectTrigger>
              <SelectContent>
                {bibleBooks.map((book) => (
                  <SelectItem key={book.id} value={book.id.toString()}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Select a Chapter
            </label>
            <Select
              onValueChange={handleChapterSelect}
              value={selection.chapter?.toString()}
              disabled={!selection.book}
            >
              <SelectTrigger>
                <SelectValue placeholder='Choose a chapter' />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((chapter) => (
                  <SelectItem key={chapter} value={chapter.toString()}>
                    Chapter {chapter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selection.book && (
            <div className='mt-8 p-4 bg-muted rounded-lg'>
              <p className='text-center text-muted-foreground'>
                Book Order:{' '}
                <span className='font-bold'>{selection.book.id}</span>
              </p>
            </div>
          )}

          {isLoading && (
            <div className='mt-4 text-center text-muted-foreground'>
              Loading audio...
            </div>
          )}

          {isError && (
            <div className='mt-4 text-center text-destructive'>
              Failed to load audio file:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          )}

          {audioUrl && <AudioPlayer src={audioUrl} className='mt-4' />}
        </div>
      </div>
    </div>
  );
}
