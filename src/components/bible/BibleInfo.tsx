import type { BibleBook } from '@/types/bible';

interface BibleInfoProps {
  book: BibleBook | null;
}

export function BibleInfo({ book }: BibleInfoProps) {
  if (!book) {
    return null;
  }

  return (
    <div className='mt-8 p-4 bg-muted rounded-lg'>
      <p className='text-center text-muted-foreground'>
        Book Order: <span className='font-bold'>{book.id}</span>
      </p>
    </div>
  );
}
