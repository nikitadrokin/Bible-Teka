import { useBible } from '@/components/bible/BibleContext';
import { createFileRoute } from '@tanstack/react-router';
import { BookSelector } from '@/components/bible/BookSelector';
import { BibleInfo } from '@/components/bible/BibleInfo';
import { ChapterSelector } from '@/components/bible/ChapterSelector';
import { AudioSection } from '@/components/bible/AudioSection';
import { ReaderSection } from '@/components/bible/ReaderSection';
import { HistoryDialog } from '@/components/bible/HistoryDialog';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { getYouVersionChapterUrl } from '@/lib/youversion';

export const Route = createFileRoute('/')({
  component: () => <BibleNavigator />,
});

function BibleNavigator() {
  const { t } = useTranslation();

  const {
    selection,
    audioQuery,
    handleBookSelect,
    handleChapterSelect,
    chapters,
  } = useBible();
  const youVersionUrl = getYouVersionChapterUrl(selection);

  return (
    <div className='app-container bg-background min-h-screen select-none' data-vaul-drawer-wrapper>
      <div className='container mx-auto p-4 lg:p-8 max-w-5xl'>
        <div className='flex justify-between items-center mb-8 lg:mb-12'>
          <h1 className='text-3xl font-bold text-foreground inline-block'>
            {t('appTitle')}
          </h1>
          <HistoryDialog />
        </div>

        <div className='lg:grid lg:grid-cols-12 lg:gap-12 items-start'>
          <div className='hidden lg:block lg:col-span-4 lg:sticky lg:top-8'>
            <div className='bg-card/50 rounded-2xl p-6 border shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar'>
              <BookSelector
                selectedBookId={selection.book?.id.toString()}
                onBookSelect={handleBookSelect}
              />
            </div>
          </div>

          <div className='lg:col-span-8 flex flex-col gap-8'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <BibleInfo book={selection.book} />
                <div className='flex items-center gap-2'>
                  {youVersionUrl ? (
                    <Button
                      asChild
                      variant='outline'
                      size='sm'
                      aria-label={t('openInBible')}
                    >
                      <a href={youVersionUrl} target='_blank' rel='noopener noreferrer'>
                        <ExternalLinkIcon className='h-4 w-4' />
                        {t('openInBible')}
                      </a>
                    </Button>
                  ) : (
                    <Button variant='outline' size='sm' disabled aria-label={t('openInBible')}>
                      <ExternalLinkIcon className='h-4 w-4' />
                      {t('openInBible')}
                    </Button>
                  )}
                </div>
              </div>

              <AudioSection
                audioUrl={audioQuery.data}
                isLoading={audioQuery.isLoading}
                isError={audioQuery.isError}
                error={audioQuery.error}
              />

              <ReaderSection />
            </div>

            <div className='px-1 lg:hidden'>
              <Separator />
            </div>

            <ChapterSelector
              chapters={chapters}
              selectedChapter={selection.chapter?.toString()}
              onChapterSelect={handleChapterSelect}
              disabled={!selection.book}
            />

            <div className='lg:hidden'>
              <BookSelector
                selectedBookId={selection.book?.id.toString()}
                onBookSelect={handleBookSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
