import { useBible } from '@/components/bible/BibleContext';
import { createFileRoute } from '@tanstack/react-router';
import { BibleProvider } from '@/components/bible/BibleContext';
import { BookSelector } from '@/components/bible/BookSelector';
import { BibleInfo } from '@/components/bible/BibleInfo';
import { ChapterSelector } from '@/components/bible/ChapterSelector';
import { AudioSection } from '@/components/bible/AudioSection';
import { Separator } from '@/components/ui/separator';

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
    <div className='min-h-screen bg-background p-8'>
      <div className='mx-auto max-w-xl grid gap-y-8'>
        <h1 className='text-3xl font-bold text-center text-foreground'>
          Bible Navigator
        </h1>

        <div className='grid gap-y-4'>
          <BibleInfo book={selection.book} />

          <AudioSection
            audioUrl={audioQuery.data}
            isLoading={audioQuery.isLoading}
            isError={audioQuery.isError}
            error={audioQuery.error}
          />
        </div>

        <div className='px-1'>
          <Separator />
        </div>

        <ChapterSelector
          chapters={chapters}
          selectedChapter={selection.chapter?.toString()}
          onChapterSelect={handleChapterSelect}
          disabled={!selection.book}
        />

        <BookSelector
          selectedBookId={selection.book?.id.toString()}
          onBookSelect={handleBookSelect}
        />
      </div>
    </div>
  );
}
