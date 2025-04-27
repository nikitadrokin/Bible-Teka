import { bibleBooks } from '@/data/bible';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface BookSelectorProps {
  selectedBookId: string | undefined;
  onBookSelect: (value: string) => void;
}

export function BookSelector({
  selectedBookId,
  onBookSelect,
}: BookSelectorProps) {
  // Split books into Old Testament (0-38) and New Testament (39-65)
  const oldTestamentBooks = bibleBooks.slice(0, 39);
  const newTestamentBooks = bibleBooks.slice(39);

  return (
    <div className='grid gap-4'>
      <h3 className='text-sm font-semibold'>Select a Book</h3>

      <div className='grid gap-8'>
        <div className='grid gap-3'>
          <Label className='text-sm font-medium leading-none'>
            Old Testament
          </Label>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(115px,1fr))] gap-y-2 gap-x-4'>
            {oldTestamentBooks.map((book) => (
              <Button
                key={book.id}
                onClick={() => onBookSelect(book.id.toString())}
                variant={
                  selectedBookId === book.id.toString() ? 'secondary' : 'ghost'
                }
                size='sm'
                type='button'
                aria-selected={selectedBookId === book.id.toString()}
                className='justify-start transition-none'
              >
                {book.name}
              </Button>
            ))}
          </div>
        </div>

        <div className='grid gap-3'>
          <Label className='text-sm font-medium leading-none'>
            New Testament
          </Label>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(115px,1fr))] gap-y-2 gap-x-4'>
            {newTestamentBooks.map((book) => (
              <Button
                key={book.id}
                onClick={() => onBookSelect(book.id.toString())}
                variant={
                  selectedBookId === book.id.toString() ? 'secondary' : 'ghost'
                }
                size='sm'
                type='button'
                aria-selected={selectedBookId === book.id.toString()}
                className='justify-start transition-none'
              >
                {book.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
