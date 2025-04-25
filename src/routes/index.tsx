import { useBible } from '@/components/bible/BibleContext';
import { createFileRoute } from '@tanstack/react-router';
import { BibleProvider } from '@/components/bible/BibleContext';
import { BookSelector } from '@/components/bible/BookSelector';
import { BibleInfo } from '@/components/bible/BibleInfo';
import { ChapterSelector } from '@/components/bible/ChapterSelector';
import { AudioSection } from '@/components/bible/AudioSection';

export const Route = createFileRoute('/')({
  component: () => <BibleNavigator />,
});

function BibleNavigator() {
  const {
    selection,
    audioQuery,
    handleBookSelect,
    handleChapterSelect,
    chapters,
  } = useBible();

  return (
    <BibleProvider>
      <div className='min-h-screen bg-background p-8'>
        <div className='mx-auto max-w-lg space-y-8'>
          <h1 className='text-3xl font-bold text-center text-foreground'>
            Bible Navigator
          </h1>

          <div className='space-y-4'>
            <BookSelector
              selectedBookId={selection.book?.id.toString()}
              onBookSelect={handleBookSelect}
            />

            <ChapterSelector
              chapters={chapters}
              selectedChapter={selection.chapter?.toString()}
              onChapterSelect={handleChapterSelect}
              disabled={!selection.book}
            />

            <BibleInfo book={selection.book} />

            <AudioSection
              audioUrl={audioQuery.data}
              isLoading={audioQuery.isLoading}
              isError={audioQuery.isError}
              error={audioQuery.error}
            />
          </div>
        </div>
      </div>
    </BibleProvider>
  );
}
