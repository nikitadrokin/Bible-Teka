import { useBible } from './BibleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/store/locale-store';
import { formatDateTime } from '@/lib/utils';
import { useHistoryStore } from '@/store/history-store';
import type { HistoryEntry } from '@/store/history-store';

export function HistorySection() {
  const { setSelection } = useBible();
  const { locale } = useLocaleStore();
  const { history, clearHistory } = useHistoryStore();

  const handleSelectHistoryItem = (entry: HistoryEntry) => {
    if (entry.book && entry.chapter) {
      setSelection({
        book: entry.book,
        chapter: entry.chapter,
      });
    }
  };

  const getFormattedDate = (timestamp: number) => {
    return formatDateTime(new Date(timestamp), locale);
  };

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-lg'>
          {locale === 'en' ? 'Reading History' : 'История чтения'}
        </CardTitle>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => clearHistory()}
          className='h-8 px-2 text-xs'
        >
          {locale === 'en' ? 'Clear History' : 'Очистить историю'}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[200px] w-full pr-4'>
          {history.length === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-8'>
              {locale === 'en'
                ? 'No reading history yet'
                : 'История чтения пуста'}
            </p>
          ) : (
            <ul className='space-y-2'>
              {history.map((entry, index) => (
                <li key={index}>
                  <Button
                    variant='ghost'
                    className='w-full justify-start text-left h-auto py-2'
                    onClick={() => handleSelectHistoryItem(entry)}
                  >
                    <div>
                      <div className='font-medium'>
                        {entry.book?.name} {entry.chapter}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {getFormattedDate(entry.timestamp)}
                      </div>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
