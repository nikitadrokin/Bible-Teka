import { useBible } from '@/components/bible/BibleContext';
import { createFileRoute } from '@tanstack/react-router';
import { BibleProvider } from '@/components/bible/BibleContext';
import { BookSelector } from '@/components/bible/BookSelector';
import { BibleInfo } from '@/components/bible/BibleInfo';
import { ChapterSelector } from '@/components/bible/ChapterSelector';
import { AudioSection } from '@/components/bible/AudioSection';
import { HistoryDialog } from '@/components/bible/HistoryDialog';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { useSyncLanguage } from '@/lib/i18n';

export const Route = createFileRoute('/')({
  component: () => <BibleNavigator />,
});

function BibleNavigator() {
  const { t } = useTranslation();
  // Sync language between i18n and our store
  useSyncLanguage();

  const {
    selection,
    audioQuery,
    handleBookSelect,
    handleChapterSelect,
    chapters,
  } = useBible();

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='mx-auto grid gap-y-8 md:grid md:grid-cols-3 md:gap-8'>
        {/* Left Column */}
        <div className='md:col-span-1'>
          <AudioSection
            audioUrl={audioQuery.data}
            isLoading={audioQuery.isLoading}
            isError={audioQuery.isError}
            error={audioQuery.error}
          />
        </div>

        {/* Right Column */}
        <div className='md:col-span-2 grid gap-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold text-foreground inline-block'>
              {t('appTitle')}
            </h1>
            <LocaleSwitcher />
          </div>

          <div className='grid gap-y-2'> {/* This div originally wrapped BibleInfo and HistoryDialog along with AudioSection. We keep its structure for these two. */}
            <div className='flex items-center justify-between gap-2'>
              <BibleInfo book={selection.book} />
              <HistoryDialog />
            </div>
          </div>

          <Separator />

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
    </div>
  );
}
