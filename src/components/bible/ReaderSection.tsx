import { useTranslation } from 'react-i18next';
import {
  usePassage,
  useVersions,
  useYVAuth,
} from '@youversion/platform-react-hooks';
import { BookOpenIcon, ChevronDownIcon, LogOutIcon } from 'lucide-react';
import { useBible } from './BibleContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollArea from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { YouVersionClientProvider } from '@/integrations/youversion/provider';
import { useBibleVersionStore } from '@/store/bible-version-store';
import { getUsfmChapter } from '@/lib/youversion';
import { cn } from '@/lib/utils';

export function ReaderSection() {
  return (
    <YouVersionClientProvider>
      <ReaderContent />
    </YouVersionClientProvider>
  );
}

function ReaderContent() {
  const { t } = useTranslation();
  const { selection } = useBible();
  const { auth, userInfo, signIn, signOut } = useYVAuth();
  const { versionId, setVersionId, readerOpen, setReaderOpen } =
    useBibleVersionStore();

  const usfm = getUsfmChapter(selection);

  if (!usfm || auth.isLoading) {
    return null;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className='bg-card mt-4 flex flex-col items-center gap-3 rounded-lg border-2 p-6 text-center'>
        <BookOpenIcon className='text-muted-foreground h-6 w-6' />
        <p className='text-muted-foreground text-sm'>
          {t('readerSignInPrompt')}
        </p>
        <Button
          variant='outline'
          onClick={() => signIn({ scopes: ['profile'] })}
        >
          {t('signInWithYouVersion')}
        </Button>
      </div>
    );
  }

  return (
    <div className='bg-card mt-4 flex flex-col rounded-lg border-2'>
      <div className='flex flex-wrap items-center justify-between gap-2 p-4'>
        <Button
          variant='ghost'
          size='sm'
          className='-ml-2'
          onClick={() => setReaderOpen(!readerOpen)}
          aria-expanded={readerOpen}
        >
          <BookOpenIcon className='h-4 w-4' />
          {t('chapterText')}
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 transition-transform',
              readerOpen && 'rotate-180',
            )}
          />
        </Button>

        <div className='flex items-center gap-2'>
          <VersionSelect versionId={versionId} onVersionChange={setVersionId} />
          <Button
            variant='ghost'
            size='icon'
            onClick={() => signOut()}
            aria-label={t('signOutAction')}
            title={userInfo?.name ?? t('signOutAction')}
          >
            <LogOutIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {readerOpen && (
        <PassageView versionId={versionId} usfm={usfm} />
      )}
    </div>
  );
}

function VersionSelect({
  versionId,
  onVersionChange,
}: {
  versionId: number;
  onVersionChange: (versionId: number) => void;
}) {
  const { t } = useTranslation();
  const { versions } = useVersions('ru');
  const versionList = versions?.data ?? [];

  return (
    <Select
      value={versionId.toString()}
      onValueChange={(value) => onVersionChange(parseInt(value))}
    >
      <SelectTrigger
        className='h-8 w-auto gap-1 text-xs'
        aria-label={t('translationLabel')}
      >
        <SelectValue placeholder={t('translationLabel')} />
      </SelectTrigger>
      <SelectContent>
        {versionList.map((version) => (
          <SelectItem key={version.id} value={version.id.toString()}>
            {version.localized_abbreviation} — {version.localized_title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function PassageView({ versionId, usfm }: { versionId: number; usfm: string }) {
  const { t } = useTranslation();
  const { passage, loading, error } = usePassage({
    versionId,
    usfm,
    format: 'html',
    include_headings: true,
  });

  if (loading) {
    return (
      <div className='flex flex-col gap-3 px-4 pb-4'>
        <Skeleton className='h-4 w-1/3' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </div>
    );
  }

  if (error || !passage) {
    return (
      <p className='text-destructive px-4 pb-4 text-sm'>
        {t('failedToLoadText')}
      </p>
    );
  }

  return (
    <ScrollArea
      className='max-h-[60vh] px-4 pb-4'
      gradientColor='var(--card)'
    >
      <div
        className='bible-reader select-text'
        dangerouslySetInnerHTML={{ __html: passage.content }}
      />
    </ScrollArea>
  );
}
