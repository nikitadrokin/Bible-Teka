import { AudioPlayer } from '@/components/ui/audio-player';

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
        <div className='mt-4 text-center text-muted-foreground'>
          Loading audio...
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
