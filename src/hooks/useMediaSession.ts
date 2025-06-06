import { useEffect, useRef } from 'react';
import type { BibleBook } from '@/types/bible';
import { useTranslation } from 'react-i18next';

interface MediaSessionMetadata {
  title: string;
  artist: string;
  album: string;
  artwork?: { src: string; sizes: string; type: string }[];
}

interface UseMediaSessionProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  book: BibleBook | null;
  chapter: number | null;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
}

export function useMediaSession({
  isPlaying,
  currentTime,
  duration,
  book,
  chapter,
  onPlay,
  onPause,
  onSeek,
}: UseMediaSessionProps) {
  const { t } = useTranslation();
  const artist = t('appTitle');

  const lastUpdateRef = useRef<number>(0);

  // Seek forward 10 seconds
  const handleSeekForward = (details: MediaSessionActionDetails) => {
    const { seekOffset = 10 } = details;
    const newTime = Math.min(currentTime + seekOffset, duration);
    onSeek(newTime);
  };

  // Seek backward 10 seconds
  const handleSeekBackward = (details: MediaSessionActionDetails) => {
    const { seekOffset = 10 } = details;
    const newTime = Math.max(currentTime - seekOffset, 0);
    onSeek(newTime);
  };

  // Set up Media Session metadata when book/chapter changes
  useEffect(() => {
    if (!('mediaSession' in navigator) || !book || !chapter) return;

    const metadata: MediaSessionMetadata = {
      title: `${book.name} ${chapter}`,
      artist,
      album: book.name,
      artwork: [
        {
          src: '/logo.png',
          sizes: 'any',
          type: 'image/png',
        },
      ],
    };

    navigator.mediaSession.metadata = new MediaMetadata(metadata);
  }, [book, chapter]);

  // Set up Media Session action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const actionHandlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', onPlay],
      ['pause', onPause],
      ['seekbackward', handleSeekBackward],
      ['seekforward', handleSeekForward],
    ];

    actionHandlers.push([
      'seekto',
      (details) => {
        if (details.seekTime !== undefined) {
          onSeek(details.seekTime);
        }
      },
    ]);

    // Set all action handlers
    actionHandlers.forEach(([action, handler]) => {
      navigator.mediaSession.setActionHandler(action, handler);
    });

    // Cleanup action handlers
    return () => {
      actionHandlers.forEach(([action]) => {
        navigator.mediaSession.setActionHandler(action, null);
      });
    };
  }, [onPlay, onPause, onSeek, currentTime, duration]);

  // Update playback state and position
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  // Update position state (throttled to avoid too many updates)
  useEffect(() => {
    if (!('mediaSession' in navigator) || !duration || duration === 0) return;

    const now = Date.now();
    // Throttle updates to every second
    if (now - lastUpdateRef.current < 1000) return;
    lastUpdateRef.current = now;

    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: 1,
      position: currentTime,
    });
  }, [currentTime, duration]);
}
