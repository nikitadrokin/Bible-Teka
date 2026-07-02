import { useBible } from '@/components/bible/BibleContext';
import { createFileRoute } from '@tanstack/react-router';
import { BookSelector } from '@/components/bible/BookSelector';
import { BookPickerDrawer } from '@/components/bible/BookPickerDrawer';
import { BibleInfo } from '@/components/bible/BibleInfo';
import { ChapterSelector } from '@/components/bible/ChapterSelector';
import { AudioSection } from '@/components/bible/AudioSection';
import { HistoryDialog } from '@/components/bible/HistoryDialog';
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
    <div
      className='app-container min-h-screen select-none bg-background'
      data-vaul-drawer-wrapper
    >
      <div className='container mx-auto max-w-5xl px-4 pb-8 pt-4 lg:p-8'>
        {/* Header */}
        <header className='mb-6 flex items-center justify-between lg:mb-12'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground lg:text-3xl'>
            {t('appTitle')}
          </h1>
          <LocaleSwitcher />
        </header>

        <div className='items-start lg:grid lg:grid-cols-12 lg:gap-12'>
          {/* Desktop sidebar */}
          <aside className='hidden lg:col-span-4 lg:sticky lg:top-8 lg:block'>
            <div className='custom-scrollbar max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border bg-card/50 p-6 shadow-sm'>
              <BookSelector
                selectedBookId={selection.book?.id.toString()}
                onBookSelect={handleBookSelect}
              />
            </div>
          </aside>

          {/* Main content */}
          <main className='flex flex-col gap-5 lg:col-span-8 lg:gap-8'>
            {/* Mobile hero + actions */}
            <div className='flex flex-col gap-4 lg:hidden'>
              <BibleInfo book={selection.book} variant='hero' />

              <div className='flex items-stretch gap-2'>
                <BookPickerDrawer
                  selectedBookId={selection.book?.id.toString()}
                  onBookSelect={handleBookSelect}
                  bookName={selection.book?.name}
                />
                <HistoryDialog variant='mobile' />
              </div>
            </div>

            {/* Desktop info row */}
            <div className='hidden flex-col gap-2 lg:flex'>
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
                      <a
                        href={youVersionUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <ExternalLinkIcon className='h-4 w-4' />
                        {t('openInBible')}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant='outline'
                      size='sm'
                      disabled
                      aria-label={t('openInBible')}
                    >
                      <ExternalLinkIcon className='h-4 w-4' />
                      {t('openInBible')}
                    </Button>
                  )}
                  <HistoryDialog />
                </div>
              </div>
            </div>

            <AudioSection
              audioUrl={audioQuery.data}
              isLoading={audioQuery.isLoading}
              isError={audioQuery.isError}
              error={audioQuery.error}
            />

            {/* Mobile secondary actions */}
            {youVersionUrl && (
              <Button
                asChild
                variant='outline'
                size='sm'
                className='w-full rounded-xl lg:hidden'
                aria-label={t('openInBible')}
              >
                <a
                  href={youVersionUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <ExternalLinkIcon className='h-4 w-4' />
                  {t('openInBible')}
                </a>
              </Button>
            )}

            <ChapterSelector
              chapters={chapters}
              selectedChapter={selection.chapter?.toString()}
              onChapterSelect={handleChapterSelect}
              disabled={!selection.book}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
