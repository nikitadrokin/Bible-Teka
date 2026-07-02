import type { BibleBook } from '@/types/bible';
import { useBible } from './BibleContext';
import { cn } from '@/lib/utils';
import { BookOpenIcon } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useTranslation } from 'react-i18next';

interface BibleInfoProps {
  book: BibleBook | null;
  variant?: 'default' | 'hero';
}

export function BibleInfo({ book, variant = 'default' }: BibleInfoProps) {
  const { selection } = useBible();
  const { t } = useTranslation();

  if (!book || !selection.chapter) {
    return variant === 'hero' ? (
      <div className='space-y-3 py-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-10 w-48' />
        <Skeleton className='h-5 w-32' />
      </div>
    ) : (
      <Skeleton className='h-8 w-36' />
    );
  }

  if (variant === 'hero') {
    return (
      <div className='space-y-1 py-1'>
        <div className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary'>
          <BookOpenIcon className='size-3.5' />
          {t('nowListening')}
        </div>
        <h2 className='text-3xl font-bold tracking-tight text-foreground'>
          {book.name}
        </h2>
        <p className='text-lg font-medium text-muted-foreground'>
          {t('chapterLabel', { number: selection.chapter })}
        </p>
      </div>
    );
  }

  return (
    <div className='inline-flex w-fit items-center gap-2 rounded-lg bg-muted px-3 py-1.5 font-medium text-muted-foreground'>
      <BookOpenIcon className='h-4 w-4' />
      <span className={cn('whitespace-nowrap')}>
        {book.name} {selection.chapter}
      </span>
    </div>
  );
}
