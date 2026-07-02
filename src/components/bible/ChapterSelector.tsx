import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ChapterSelectorProps {
  chapters: number[];
  selectedChapter: string | undefined;
  onChapterSelect: (value: string) => void;
  disabled: boolean;
}

const CHAPTER_RANGE_SIZE = 30;
const LARGE_BOOK_THRESHOLD = 30;

function getChapterRanges(chapters: number[]): Array<{ start: number; end: number }> {
  if (chapters.length <= LARGE_BOOK_THRESHOLD) {
    return [{ start: chapters[0], end: chapters[chapters.length - 1] }];
  }

  const ranges: Array<{ start: number; end: number }> = [];
  for (let start = 1; start <= chapters.length; start += CHAPTER_RANGE_SIZE) {
    const end = Math.min(start + CHAPTER_RANGE_SIZE - 1, chapters.length);
    ranges.push({ start, end });
  }
  return ranges;
}

export function ChapterSelector({
  chapters,
  selectedChapter,
  onChapterSelect,
  disabled,
}: ChapterSelectorProps) {
  const { t } = useTranslation();
  const ranges = useMemo(() => getChapterRanges(chapters), [chapters]);
  const selectedChapterNumber = selectedChapter
    ? parseInt(selectedChapter, 10)
    : 1;

  const initialRangeIndex = useMemo(() => {
    if (ranges.length <= 1) return 0;
    const index = ranges.findIndex(
      (range) =>
        selectedChapterNumber >= range.start &&
        selectedChapterNumber <= range.end,
    );
    return index >= 0 ? index : 0;
  }, [ranges, selectedChapterNumber]);

  const [activeRangeIndex, setActiveRangeIndex] = useState(initialRangeIndex);

  useEffect(() => {
    setActiveRangeIndex(initialRangeIndex);
  }, [initialRangeIndex, chapters]);

  const activeRange = ranges[activeRangeIndex] ?? ranges[0];
  const visibleChapters = chapters.filter(
    (chapter) =>
      chapter >= activeRange.start && chapter <= activeRange.end,
  );

  return (
    <section
      className={cn(
        'grid gap-4',
        'max-lg:rounded-2xl max-lg:border-2 max-lg:bg-card/70 max-lg:p-4 max-lg:shadow-sm max-lg:backdrop-blur-sm',
      )}
    >
      <div className='flex items-end justify-between gap-3'>
        <div>
          <p className='text-sm font-medium leading-none text-foreground max-lg:text-base'>
            {t('selectChapter')}
          </p>
          {chapters.length > 0 && (
            <p className='mt-1.5 hidden text-xs text-muted-foreground max-lg:block'>
              {t('chapterCount', { count: chapters.length })}
            </p>
          )}
        </div>
      </div>

      {ranges.length > 1 && (
        <div className='-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {ranges.map((range, index) => {
            const isActive = index === activeRangeIndex;
            return (
              <Button
                key={`${range.start}-${range.end}`}
                type='button'
                variant={isActive ? 'secondary' : 'outline'}
                size='sm'
                onClick={() => setActiveRangeIndex(index)}
                className={cn(
                  'shrink-0 rounded-full px-3.5',
                  isActive && 'border-primary/30 shadow-sm',
                )}
              >
                {range.start}–{range.end}
              </Button>
            );
          })}
        </div>
      )}

      <div
        className={cn(
          'grid gap-2',
          'max-lg:grid-cols-5 max-lg:sm:grid-cols-6',
          'lg:grid-cols-[repeat(auto-fill,minmax(60px,1fr))]',
        )}
      >
        {visibleChapters.map((chapter) => {
          const isSelected = selectedChapter === chapter.toString();

          return (
            <Button
              key={chapter}
              onClick={() => onChapterSelect(chapter.toString())}
              variant={isSelected ? 'secondary' : 'outline'}
              size='sm'
              type='button'
              disabled={disabled}
              aria-selected={isSelected}
              className={cn(
                'aspect-square h-auto w-full p-0 text-sm font-semibold tabular-nums',
                'max-lg:min-h-11 max-lg:rounded-xl',
                'lg:min-h-8 lg:rounded-md',
                isSelected &&
                  'border-primary/30 bg-secondary text-secondary-foreground shadow-sm',
                !isSelected &&
                  'max-lg:border-border/70 max-lg:bg-background/60 max-lg:hover:bg-accent/80',
              )}
            >
              {chapter}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
