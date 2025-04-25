import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className='space-y-2'>
      <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
        Select a Chapter
      </label>
      <Select
        onValueChange={onChapterSelect}
        value={selectedChapter}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder='Choose a chapter' />
        </SelectTrigger>
        <SelectContent>
          {chapters.map((chapter) => (
            <SelectItem key={chapter} value={chapter.toString()}>
              Chapter {chapter}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
