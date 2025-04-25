import { AudioPlayer } from '@/components/ui/audio-player';
import { Skeleton } from '../ui/skeleton';

interface AudioSectionProps {
  audioUrl: string | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export function AudioSection({
  audioUrl,
  isLoading,
  isError,
  error,
}: AudioSectionProps) {
  return (
    <>
      {isLoading && (
        <div className='flex flex-col gap-4 rounded-lg border-2 bg-card p-4 flex-wrap mt-4'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-8 w-36' />
            <div className='flex items-center space-x-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-4 w-24' />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-8 w-8 rounded-full' />
            <div className='flex flex-1 items-center space-x-2 pl-4'>
              <Skeleton className='w-12 h-4' />
              <Skeleton className='w-full h-4' />
              <Skeleton className='w-12 h-4' />
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className='mt-4 text-center text-destructive'>
          Failed to load audio file:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      )}

      {audioUrl && <AudioPlayer src={audioUrl} className='mt-4' />}
    </>
  );
}
