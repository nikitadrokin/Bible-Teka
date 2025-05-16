import type { BibleBook } from '@/types/bible';
import { useBible } from './BibleContext';
import { cn } from '@/lib/utils';
import { BookOpenIcon } from 'lucide-react';

interface BibleInfoProps {
  book: BibleBook | null;
}

export function BibleInfo({ book }: BibleInfoProps) {
  const { selection } = useBible();

  if (!book || !selection.chapter) {
    return null;
  }

  return (
    <div className='inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-lg text-muted-foreground bg-muted font-medium'>
      <BookOpenIcon className='h-4 w-4' />
      <span className={cn('whitespace-nowrap')}>
        {book.name} {selection.chapter}
      </span>
    </div>
  );
}
