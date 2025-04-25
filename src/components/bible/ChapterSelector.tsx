import { Button } from '../ui/button';
interface ChapterSelectorProps {
  chapters: number[];
  selectedChapter: string | undefined;
  onChapterSelect: (value: string) => void;
  disabled: boolean;
}

export function ChapterSelector({
  chapters,
  selectedChapter,
  onChapterSelect,
  disabled,
}: ChapterSelectorProps) {
  return (
    <div className='grid gap-4'>
      <label className='text-sm font-medium leading-none'>
        Select a Chapter
      </label>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2'>
        {chapters.map((chapter) => (
          <Button
            key={chapter}
            onClick={() => onChapterSelect(chapter.toString())}
            variant={
              selectedChapter === chapter.toString() ? 'secondary' : 'ghost'
            }
            size='sm'
            type='button'
            disabled={disabled}
            aria-selected={selectedChapter === chapter.toString()}
          >
            {chapter}
          </Button>
        ))}
      </div>
    </div>
  );
}
