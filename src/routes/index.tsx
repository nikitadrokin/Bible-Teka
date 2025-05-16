import { useBible } from '@/components/bible/BibleContext';
import { createFileRoute } from '@tanstack/react-router';
import { BibleProvider } from '@/components/bible/BibleContext';
import { BookSelector } from '@/components/bible/BookSelector';
import { BibleInfo } from '@/components/bible/BibleInfo';
import { ChapterSelector } from '@/components/bible/ChapterSelector';
import { AudioSection } from '@/components/bible/AudioSection';
import { HistorySection } from '@/components/bible/HistorySection';
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
      <div className='mx-auto max-w-xl grid gap-y-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-foreground inline-block'>
            {t('appTitle')}
          </h1>
          <LocaleSwitcher />
        </div>

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

        <HistorySection />

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
