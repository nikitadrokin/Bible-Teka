import { useBible } from './BibleContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocaleStore } from '@/store/locale-store';
import { formatDateTime } from '@/lib/utils';
import { useHistoryStore } from '@/store/history-store';
import type { HistoryEntry } from '@/store/history-store';
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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { DrawerClose } from '../ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

export function HistoryDialog() {
  const { setSelection } = useBible();
  const { locale } = useLocaleStore();
  const { history, clearHistory } = useHistoryStore();
  const { t } = useTranslation();

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleSelectHistoryItem = (entry: HistoryEntry) => {
    if (entry.book && entry.chapter) {
      setSelection({
        book: entry.book,
        chapter: entry.chapter,
      });
    }
  };

  const getFormattedDate = (timestamp: number) => {
    return formatDateTime(new Date(timestamp), locale);
  };

  if (isDesktop)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='ghost' aria-label={t('readingHistory')}>
            <ClockIcon className='h-5 w-5' />
            {t('viewHistory')}
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader className='flex flex-row items-center justify-between pb-2'>
            <DialogTitle className='text-lg font-bold mr-auto'>
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
              <p className='text-sm text-muted-foreground text-center py-8'>
                {t('noHistory')}
              </p>
            ) : (
              <ul className='space-y-2'>
                {history.map((entry, index) => (
                  <DialogClose asChild key={index}>
                    <li>
                      <Button
                        variant='ghost'
                        className='w-full justify-start text-left h-auto py-2'
                        onClick={() => handleSelectHistoryItem(entry)}
                      >
                        <div>
                          <div className='font-medium'>
                            {entry.book?.name} {entry.chapter}
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
    <Drawer shouldScaleBackground={true}>
      <DrawerTrigger asChild>
        <Button variant='ghost' aria-label={t('readingHistory')}>
          <ClockIcon className='h-5 w-5' />
          {t('viewHistory')}
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-full'>
        <DrawerHeader className='flex flex-row items-center justify-between pb-2'>
          <DrawerTitle className='text-lg font-bold mr-auto'>
            {t('readingHistory')}
          </DrawerTitle>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => clearHistory()}
            className='h-8 px-2 text-xs'
          >
            {t('clearHistory')}
          </Button>
          <DrawerClose asChild>
            <Button variant='ghost' size='sm' aria-label={t('close')}>
              <XIcon className='h-5 w-5' />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <ScrollArea className='w-full pr-4 mt-4'>
          {history.length === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-8'>
              {t('noHistory')}
            </p>
          ) : (
            <ul className='space-y-2'>
              {history.map((entry, index) => (
                <DrawerClose asChild key={index}>
                  <li>
                    <Button
                      variant='ghost'
                      className='w-full justify-start text-left h-auto py-2'
                      onClick={() => handleSelectHistoryItem(entry)}
                    >
                      <div>
                        <div className='font-medium'>
                          {entry.book?.name} {entry.chapter}
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
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
