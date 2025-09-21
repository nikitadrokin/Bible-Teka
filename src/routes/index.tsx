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
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import { getYouVersionChapterUrl } from '@/lib/youversion';
import { useLocaleStore } from '@/store/locale-store';

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
  const locale = useLocaleStore((state) => state.locale);
  const youVersionUrl = getYouVersionChapterUrl(selection, locale);

  return (
    <div className='app-container bg-background' data-vaul-drawer-wrapper>
      <div className='mx-auto max-w-xl grid gap-y-8 p-4 md:p-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-foreground inline-block'>
            {t('appTitle')}
          </h1>

          <LocaleSwitcher />
        </div>

        <div className='grid gap-y-2'>
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
              <HistoryDialog />
            </div>
          </div>

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
