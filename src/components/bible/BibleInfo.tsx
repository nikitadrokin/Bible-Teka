import type { BibleBook } from '@/types/bible';
import { useBible } from './BibleContext';

interface BibleInfoProps {
  book: BibleBook | null;
}

export function BibleInfo({ book }: BibleInfoProps) {
  const { selection } = useBible();

  return (
    <div className='mt-8 p-4 bg-muted rounded-lg'>
      <p className='text-center text-muted-foreground font-bold'>
        {book?.name} {selection.chapter}
      </p>
    </div>
  );
}
