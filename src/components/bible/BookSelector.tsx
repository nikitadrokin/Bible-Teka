import { bibleBooksEnglish, bibleBooksRussian } from '@/data/bible';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useTranslation } from 'react-i18next';
import { useLocaleStore } from '@/store/locale-store';
import { cn } from '@/lib/utils';

interface BookSelectorProps {
  selectedBookId: string | undefined;
  onBookSelect: (value: string) => void;
}

export function BookSelector({
  selectedBookId,
  onBookSelect,
}: BookSelectorProps) {
  const { t } = useTranslation();
  const { locale } = useLocaleStore();

  const books = locale === 'en' ? bibleBooksEnglish : bibleBooksRussian;

  // Split books into Old Testament (0-38) and New Testament (39-65)
  const oldTestamentBooks = books.slice(0, 39);
  const newTestamentBooks = books.slice(39);

  return (
    <div className='grid gap-4'>
      <h3 className='text-sm font-semibold select-none'>{t('selectBook')}</h3>

      <div className='grid gap-8'>
        <div className='grid gap-3'>
          <Label className='text-sm font-medium leading-none'>
            {t('oldTestament')}
          </Label>
          <div
            className={cn(
              'grid gap-y-2 gap-x-4',
              locale === 'en'
                ? 'grid-cols-[repeat(auto-fill,minmax(115px,1fr))]'
                : 'grid-cols-[repeat(auto-fill,minmax(145px,1fr))]',
            )}
          >
            {oldTestamentBooks.map((book) => {
              const isSelected = selectedBookId === book.id.toString();

              return (
                <Button
                  key={book.id}
                  onClick={() => onBookSelect(book.id.toString())}
                  variant='ghost'
                  size='sm'
                  type='button'
                  aria-selected={isSelected}
                  className='w-full justify-start transition-none hover:bg-transparent px-0 relative'
                >
                  <span
                    className={cn(
                      'rounded-md px-2 py-1',
                      isSelected
                        ? 'bg-secondary text-secondary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {book.name}
                    <span className='absolute inset-0' />
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className='grid gap-3'>
          <Label className='text-sm font-medium leading-none'>
            {t('newTestament')}
          </Label>
          <div
            className={cn(
              'grid gap-y-2 gap-x-4',
              locale === 'en'
                ? 'grid-cols-[repeat(auto-fill,minmax(115px,1fr))]'
                : 'grid-cols-[repeat(auto-fill,minmax(145px,1fr))]',
            )}
          >
            {newTestamentBooks.map((book) => {
              const isSelected = selectedBookId === book.id.toString();

              return (
                <Button
                  key={book.id}
                  onClick={() => onBookSelect(book.id.toString())}
                  variant='ghost'
                  size='sm'
                  type='button'
                  aria-selected={isSelected}
                  className='w-full justify-start transition-none hover:bg-transparent px-0 relative'
                >
                  <span
                    className={cn(
                      'rounded-md px-2 py-1',
                      isSelected
                        ? 'bg-secondary text-secondary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {book.name}
                    <span className='absolute inset-0' />
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
