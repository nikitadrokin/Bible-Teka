import { useBible } from './BibleContext';
import { Button } from '@/components/ui/button';
import ScrollArea from '@/components/ui/scroll-area';
import { useLocaleStore } from '@/store/locale-store';
import { formatDateTime } from '@/lib/utils';
import { useHistoryStore } from '@/store/history-store';
import type { HistoryEntry } from '@/store/history-store';
import { bibleBooksEnglish, bibleBooksRussian } from '@/data/bible';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ClockIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { DrawerClose } from '../ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface HistoryDialogProps {
  variant?: 'default' | 'mobile';
}

export function HistoryDialog({ variant = 'default' }: HistoryDialogProps) {
  const { setSelection } = useBible();
  const { locale } = useLocaleStore();
  const { history, clearHistory } = useHistoryStore();
  const { t } = useTranslation();

  const books = locale === 'en' ? bibleBooksEnglish : bibleBooksRussian;
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleSelectHistoryItem = (entry: HistoryEntry) => {
    const book = books.find((b) => b.id === entry.bookId);
    if (book && entry.chapter) {
      setSelection({
        book: book,
        chapter: entry.chapter,
      });
    }
  };

  const getFormattedDate = (timestamp: number) => {
    return formatDateTime(new Date(timestamp), locale);
  };

  const getBookName = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    return book?.name || '';
  };

  const triggerButton = (
    <Button
      variant={variant === 'mobile' ? 'outline' : 'ghost'}
      aria-label={t('readingHistory')}
      className={cn(
        variant === 'mobile' &&
          'size-11 shrink-0 rounded-xl border-2 bg-card/80 shadow-sm active:scale-[0.98]',
      )}
    >
      <ClockIcon className={variant === 'mobile' ? 'size-5' : 'h-5 w-5'} />
      {variant === 'default' && t('viewHistory')}
    </Button>
  );

  if (isDesktop)
    return (
      <Dialog>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader className='flex flex-row items-center justify-between pb-2'>
            <DialogTitle className='mr-auto text-lg font-bold'>
              {t('readingHistory')}
            </DialogTitle>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => clearHistory()}
              className='h-8 px-2 text-xs'
            >
              {t('clearHistory')}
            </Button>
            <DialogClose asChild>
              <Button variant='ghost' size='sm' aria-label={t('close')}>
                <XIcon className='h-5 w-5' />
              </Button>
            </DialogClose>
          </DialogHeader>
          <ScrollArea className='h-[300px] w-full pr-4'>
            {history.length === 0 ? (
              <p className='py-8 text-center text-sm text-muted-foreground'>
                {t('noHistory')}
              </p>
            ) : (
              <ul className='space-y-2'>
                {history.map((entry, index) => (
                  <DialogClose asChild key={index}>
                    <li>
                      <Button
                        variant='ghost'
                        className='h-auto w-full justify-start py-2 text-left'
                        onClick={() => handleSelectHistoryItem(entry)}
                      >
                        <div>
                          <div className='font-medium'>
                            {getBookName(entry.bookId)} {entry.chapter}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {getFormattedDate(entry.timestamp)}
                          </div>
                        </div>
                      </Button>
                    </li>
                  </DialogClose>
                ))}
              </ul>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className='max-h-[88dvh]'>
        <DrawerHeader className='flex flex-row items-center justify-between border-b border-border/60 pb-4 text-left'>
          <DrawerTitle className='text-xl font-bold'>
            {t('readingHistory')}
          </DrawerTitle>
          <div className='flex items-center gap-2'>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => clearHistory()}
              className='h-8 px-2 text-xs'
            >
              {t('clearHistory')}
            </Button>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' aria-label={t('close')}>
                <XIcon className='size-5' />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className='px-4 pt-2'>
          {history.length === 0 ? (
            <p className='py-8 text-center text-sm text-muted-foreground'>
              {t('noHistory')}
            </p>
          ) : (
            <ul className='space-y-2 pb-4'>
              {history.map((entry, index) => (
                <DrawerClose asChild key={index}>
                  <li>
                    <Button
                      variant='ghost'
                      className='h-auto w-full justify-start rounded-xl py-3 text-left'
                      onClick={() => handleSelectHistoryItem(entry)}
                    >
                      <div>
                        <div className='font-medium'>
                          {getBookName(entry.bookId)} {entry.chapter}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {getFormattedDate(entry.timestamp)}
                        </div>
                      </div>
                    </Button>
                  </li>
                </DrawerClose>
              ))}
            </ul>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
