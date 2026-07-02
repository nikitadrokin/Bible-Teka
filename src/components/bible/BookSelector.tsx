import { bibleBooksEnglish, bibleBooksRussian } from '@/data/bible';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useTranslation } from 'react-i18next';
import { useLocaleStore } from '@/store/locale-store';
import { cn } from '@/lib/utils';

interface BookSelectorProps {
  selectedBookId: string | undefined;
  onBookSelect: (value: string) => void;
  searchQuery?: string;
  variant?: 'desktop' | 'mobile';
}

export function BookSelector({
  selectedBookId,
  onBookSelect,
  searchQuery = '',
  variant = 'desktop',
}: BookSelectorProps) {
  const { t } = useTranslation();
  const { locale } = useLocaleStore();

  const books = locale === 'en' ? bibleBooksEnglish : bibleBooksRussian;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filterBooks = (bookList: typeof books) => {
    if (!normalizedQuery) return bookList;
    return bookList.filter((book) =>
      book.name.toLowerCase().includes(normalizedQuery),
    );
  };

  const oldTestamentBooks = filterBooks(books.slice(0, 39));
  const newTestamentBooks = filterBooks(books.slice(39));

  const renderBookButton = (book: (typeof books)[number]) => {
    const isSelected = selectedBookId === book.id.toString();

    if (variant === 'mobile') {
      return (
        <Button
          key={book.id}
          onClick={() => onBookSelect(book.id.toString())}
          variant={isSelected ? 'secondary' : 'outline'}
          size='sm'
          type='button'
          aria-selected={isSelected}
          className={cn(
            'h-auto min-h-10 w-full justify-start rounded-xl px-3 py-2.5 text-sm font-medium',
            isSelected && 'border-primary/30 bg-secondary shadow-sm',
          )}
        >
          <span className='truncate'>{book.name}</span>
        </Button>
      );
    }

    return (
      <Button
        key={book.id}
        onClick={() => onBookSelect(book.id.toString())}
        variant='ghost'
        size='sm'
        type='button'
        aria-selected={isSelected}
        className='relative w-full justify-start px-0 transition-none hover:bg-transparent'
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
  };

  const renderSection = (
    title: string,
    sectionBooks: typeof books,
  ) => {
    if (sectionBooks.length === 0) return null;

    return (
      <div className='grid gap-3'>
        <Label className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          {title}
        </Label>
        <div
          className={cn(
            variant === 'mobile'
              ? 'grid grid-cols-2 gap-2'
              : cn(
                  'grid gap-y-2 gap-x-4',
                  locale === 'en'
                    ? 'grid-cols-[repeat(auto-fill,minmax(115px,1fr))]'
                    : 'grid-cols-[repeat(auto-fill,minmax(145px,1fr))]',
                ),
          )}
        >
          {sectionBooks.map(renderBookButton)}
        </div>
      </div>
    );
  };

  const hasResults =
    oldTestamentBooks.length > 0 || newTestamentBooks.length > 0;

  return (
    <div className='grid gap-6'>
      {!hasResults && (
        <p className='py-8 text-center text-sm text-muted-foreground'>
          {t('noBooksFound')}
        </p>
      )}

      {renderSection(t('oldTestament'), oldTestamentBooks)}
      {renderSection(t('newTestament'), newTestamentBooks)}
    </div>
  );
}
