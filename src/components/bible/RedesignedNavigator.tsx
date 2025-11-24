import { useBible } from '@/components/bible/BibleContext';
import { BookSelector } from '@/components/bible/BookSelector';
import { ChapterSelector } from '@/components/bible/ChapterSelector';
import { AudioSection } from '@/components/bible/AudioSection';
import { HistoryDialog } from '@/components/bible/HistoryDialog';
import { useTranslation } from 'react-i18next';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { useSyncLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon, BookOpen, Hash, Play, Pause } from 'lucide-react';
import { getYouVersionChapterUrl } from '@/lib/youversion';
import { useLocaleStore } from '@/store/locale-store';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

export function RedesignedNavigator() {
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

  const [isBookDrawerOpen, setIsBookDrawerOpen] = useState(false);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);

  const handleBookSelectWrapper = (bookId: string) => {
    handleBookSelect(bookId);
    setIsBookDrawerOpen(false);
    // Automatically open chapter drawer after book selection?
    // Maybe, but let's keep it simple for now. User might just want to change book.
    // Actually, usually you pick book then chapter.
    setTimeout(() => setIsChapterDrawerOpen(true), 300);
  };

  const handleChapterSelectWrapper = (chapterId: string) => {
    handleChapterSelect(chapterId);
    setIsChapterDrawerOpen(false);
  };

  return (
    <div className='app-container relative min-h-[100dvh] flex flex-col bg-transparent' data-vaul-drawer-wrapper>
      {/* Header */}
      <header className='flex justify-between items-center p-4 z-10 safe-area-padding-top'>
        <HistoryDialog />
        <h1 className='text-sm font-medium tracking-widest uppercase text-muted-foreground/80'>
          {t('appTitle')}
        </h1>
        <LocaleSwitcher />
      </header>

      {/* Main Content - Centered */}
      <main className='flex-1 flex flex-col justify-center items-center p-6 z-0 pb-32'>
        <div className='text-center space-y-2 animate-in fade-in zoom-in duration-500'>
          <h2 className='text-4xl md:text-6xl font-serif font-bold text-foreground tracking-tight'>
            {selection.book?.name || t('selectBook')}
          </h2>
          <div className='text-8xl md:text-9xl font-serif font-black text-foreground/10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none whitespace-nowrap'>
            {selection.chapter || ''}
          </div>
          <p className='text-xl md:text-2xl text-muted-foreground font-serif italic'>
             {selection.chapter ? `${t('chapter')} ${selection.chapter}` : ''}
          </p>
        </div>

        {/* Audio Player - Floating or Integrated */}
        <div className='mt-12 w-full max-w-md'>
           <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-sm">
              <AudioSection
                audioUrl={audioQuery.data}
                isLoading={audioQuery.isLoading}
                isError={audioQuery.isError}
                error={audioQuery.error}
                minimal={true}
              />
           </div>

           {/* YouVersion Link */}
           <div className="flex justify-center mt-4">
              {youVersionUrl ? (
                <Button
                  asChild
                  variant='link'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                  size='sm'
                >
                  <a href={youVersionUrl} target='_blank' rel='noopener noreferrer' className="flex items-center gap-2">
                    <ExternalLinkIcon className='h-3 w-3' />
                    {t('openInBible')}
                  </a>
                </Button>
              ) : null}
           </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className='fixed bottom-0 left-0 right-0 p-4 z-20 safe-area-padding-bottom bg-background/80 backdrop-blur-md border-t border-border'>
        <div className='max-w-md mx-auto grid grid-cols-2 gap-4'>

          {/* Book Drawer */}
          <Drawer open={isBookDrawerOpen} onOpenChange={setIsBookDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="h-12 rounded-xl text-lg font-serif bg-card/80 shadow-sm hover:bg-accent/50 border-border/60">
                <BookOpen className="mr-2 h-5 w-5 opacity-70" />
                {selection.book?.name || t('book')}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-md">
                <DrawerHeader>
                  <DrawerTitle>{t('selectBook')}</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 h-[60vh]">
                  <ScrollArea className="h-full pr-4">
                    <BookSelector
                      selectedBookId={selection.book?.id.toString()}
                      onBookSelect={handleBookSelectWrapper}
                    />
                  </ScrollArea>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Chapter Drawer */}
          <Drawer open={isChapterDrawerOpen} onOpenChange={setIsChapterDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="h-12 rounded-xl text-lg font-serif bg-card/80 shadow-sm hover:bg-accent/50 border-border/60"
                disabled={!selection.book}
              >
                <Hash className="mr-2 h-5 w-5 opacity-70" />
                {selection.chapter || t('chapter')}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-md">
                <DrawerHeader>
                  <DrawerTitle>{t('selectChapter')}</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                   <ChapterSelector
                      chapters={chapters}
                      selectedChapter={selection.chapter?.toString()}
                      onChapterSelect={handleChapterSelectWrapper}
                      disabled={!selection.book}
                    />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">{t('cancel')}</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

        </div>
      </nav>
    </div>
  );
}
