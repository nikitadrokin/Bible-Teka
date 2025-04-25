import type { BibleBook } from '@/types/bible';
import { bibleBooks } from '@/data/bible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BookSelectorProps {
  selectedBookId: string | undefined;
  onBookSelect: (value: string) => void;
}

export function BookSelector({
  selectedBookId,
  onBookSelect,
}: BookSelectorProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
        Select a Book
      </label>
      <Select onValueChange={onBookSelect} value={selectedBookId}>
        <SelectTrigger>
          <SelectValue placeholder='Choose a book' />
        </SelectTrigger>
        <SelectContent>
          {bibleBooks.map((book) => (
            <SelectItem key={book.id} value={book.id.toString()}>
              {book.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
