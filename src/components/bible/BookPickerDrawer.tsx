import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpenIcon, SearchIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { BookSelector } from './BookSelector';
import { cn } from '@/lib/utils';

interface BookPickerDrawerProps {
  selectedBookId: string | undefined;
  onBookSelect: (value: string) => void;
  bookName?: string;
}

export function BookPickerDrawer({
  selectedBookId,
  onBookSelect,
  bookName,
}: BookPickerDrawerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookSelect = (value: string) => {
    onBookSelect(value);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-auto min-h-11 flex-1 justify-between gap-3 rounded-xl border-2 bg-card/80 px-4 py-3 text-left shadow-sm',
            'hover:bg-card active:scale-[0.98] transition-transform',
          )}
        >
          <div className='flex min-w-0 items-center gap-3'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary'>
              <BookOpenIcon className='size-4' />
            </div>
            <div className='min-w-0'>
              <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                {t('selectBook')}
              </p>
              <p className='truncate text-base font-semibold text-foreground'>
                {bookName ?? t('chooseBook')}
              </p>
            </div>
          </div>
        </Button>
      </DrawerTrigger>

      <DrawerContent className='max-h-[88dvh]'>
        <DrawerHeader className='border-b border-border/60 pb-4 text-left'>
          <div className='flex items-center justify-between gap-3'>
            <DrawerTitle className='text-xl font-bold'>
              {t('selectBook')}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' aria-label={t('close')}>
                <XIcon className='size-5' />
              </Button>
            </DrawerClose>
          </div>

          <div className='relative mt-3'>
            <SearchIcon className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <input
              type='search'
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('searchBooks')}
              className={cn(
                'h-11 w-full rounded-xl border-2 bg-background pl-10 pr-4 text-sm',
                'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50',
              )}
            />
          </div>
        </DrawerHeader>

        <div className='px-4 pb-6 pt-2'>
          <BookSelector
            selectedBookId={selectedBookId}
            onBookSelect={handleBookSelect}
            searchQuery={searchQuery}
            variant='mobile'
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
