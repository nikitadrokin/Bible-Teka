import type { BibleBook } from '@/types/bible';
import { bibleBooks } from '@/data/bible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface BookSelectorProps {
  selectedBookId: string | undefined;
  onBookSelect: (value: string) => void;
}

export function BookSelector({
  selectedBookId,
  onBookSelect,
}: BookSelectorProps) {
  // TODO: setting new book sets chapter to 01
  // we'll need to use context (uncontrolled component)

  return (
    <div className='grid gap-4'>
      <Label className='text-sm font-medium leading-none'>Select a Book</Label>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(115px,1fr))] gap-y-2 gap-x-4'>
        {bibleBooks.map((book) => (
          <Button
            key={book.id}
            onClick={() => onBookSelect(book.id.toString())}
            variant={
              selectedBookId === book.id.toString() ? 'secondary' : 'ghost'
            }
            size='sm'
            type='button'
            aria-selected={selectedBookId === book.id.toString()}
          >
            {book.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
