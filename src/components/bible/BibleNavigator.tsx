import { BibleProvider, useBible } from './BibleContext';
import { BookSelector } from './BookSelector';
import { ChapterSelector } from './ChapterSelector';
import { BibleInfo } from './BibleInfo';
import { AudioSection } from './AudioSection';

function BibleNavigatorContent() {
  const {
    selection,
    audioQuery,
    handleBookSelect,
    handleChapterSelect,
    chapters,
  } = useBible();

  return (
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
  );
}

export function BibleNavigator() {
  return (
    <BibleProvider>
      <BibleNavigatorContent />
    </BibleProvider>
  );
}
