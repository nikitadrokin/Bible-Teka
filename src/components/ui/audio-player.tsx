'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { Slider } from './slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { cn } from '@/lib/utils';
import { Gauge, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useAudioStore } from '@/store/audio-store';
import { useMediaSession } from '@/hooks/useMediaSession';
import type { BibleBook } from '@/types/bible';

interface AudioPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  book?: BibleBook | null;
  chapter?: number | null;
  onEnded?: () => void;
  onNextTrack?: () => void;
  onPreviousTrack?: () => void;
}

const PLAYBACK_SPEEDS = [
  { value: '1', label: '1x' },
  { value: '1.1', label: '1.1x' },
  { value: '1.2', label: '1.2x' },
  { value: '1.25', label: '1.25x' },
  { value: '1.5', label: '1.5x' },
  { value: '2', label: '2x' },
] as const;

export function AudioPlayer({
  src,
  book,
  chapter,
  className,
  onEnded,
  onNextTrack,
  onPreviousTrack,
  ...props
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playbackSpeed, setPlaybackSpeed } = useAudioStore();
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Debug states
  const [debugInfo, setDebugInfo] = useState({
    loadingState: 'initial',
    autoplayAttempted: false,
    autoplaySuccess: false,
    autoplayError: null as string | null,
    canPlay: false,
    canPlayThrough: false,
    userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    lastEvent: 'none',
    timestamp: new Date().toLocaleTimeString(),
    networkState: 'unknown',
    readyState: 'unknown',
    bufferedRanges: 'none',
    duration: 0,
    currentSrc: '',
    loadStartTime: null as number | null,
    iosLoadingTriggered: false,
  });

  const updateDebug = (updates: Partial<typeof debugInfo>) => {
    setDebugInfo((prev) => ({
      ...prev,
      ...updates,
      timestamp: new Date().toLocaleTimeString(),
    }));
  };

  const getNetworkStateText = (state: number) => {
    switch (state) {
      case 0:
        return 'NETWORK_EMPTY';
      case 1:
        return 'NETWORK_IDLE';
      case 2:
        return 'NETWORK_LOADING';
      case 3:
        return 'NETWORK_NO_SOURCE';
      default:
        return `UNKNOWN(${state})`;
    }
  };

  const getReadyStateText = (state: number) => {
    switch (state) {
      case 0:
        return 'HAVE_NOTHING';
      case 1:
        return 'HAVE_METADATA';
      case 2:
        return 'HAVE_CURRENT_DATA';
      case 3:
        return 'HAVE_FUTURE_DATA';
      case 4:
        return 'HAVE_ENOUGH_DATA';
      default:
        return `UNKNOWN(${state})`;
    }
  };

  const getBufferedRanges = (audio: HTMLAudioElement) => {
    const buffered = audio.buffered;
    if (buffered.length === 0) return 'none';
    const ranges = [];
    for (let i = 0; i < buffered.length; i++) {
      ranges.push(
        `${buffered.start(i).toFixed(1)}-${buffered.end(i).toFixed(1)}`,
      );
    }
    return ranges.join(', ');
  };

  // iOS-specific loading trigger
  const triggerIOSLoading = async (audio: HTMLAudioElement) => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (!isIOS) return false;

    updateDebug({
      iosLoadingTriggered: true,
      loadingState: 'triggering-ios-loading',
      lastEvent: 'ios-loading-trigger',
    });

    try {
      // Try to trigger loading by briefly starting and immediately pausing
      const playPromise = audio.play();
      if (playPromise) {
        await playPromise;
        audio.pause();
        audio.currentTime = 0;

        updateDebug({
          loadingState: 'ios-loading-triggered',
          lastEvent: 'ios-loading-success',
        });
        return true;
      }
    } catch (err) {
      console.log('iOS loading trigger failed (expected):', err);
      updateDebug({
        lastEvent: 'ios-loading-failed',
        autoplayError:
          err instanceof Error ? err.message : 'iOS loading trigger failed',
      });
    }
    return false;
  };

  const handlePlay = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setError(null);
      updateDebug({ autoplaySuccess: true, lastEvent: 'manual-play-success' });
    } catch (err) {
      console.error('Play error:', err);
      setError('Failed to play audio. Please try again.');
      updateDebug({
        autoplayError:
          err instanceof Error ? err.message : 'Unknown play error',
        lastEvent: 'manual-play-error',
      });
    }
  };

  const handlePause = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.pause();
      setIsPlaying(false);
      updateDebug({ lastEvent: 'pause' });
    } catch (err) {
      console.error('Pause error:', err);
    }
  };

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Media Session integration
  useMediaSession({
    isPlaying,
    currentTime,
    duration,
    book: book ?? null,
    chapter: chapter ?? null,
    onPlay: handlePlay,
    onPause: handlePause,
    onSeek: handleSeek,
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    updateDebug({
      loadingState: 'setting-up-listeners',
      lastEvent: 'setup-start',
      currentSrc: audio.src,
      loadStartTime: Date.now(),
    });

    const updateAudioState = (eventName: string) => {
      updateDebug({
        lastEvent: eventName,
        networkState: getNetworkStateText(audio.networkState),
        readyState: getReadyStateText(audio.readyState),
        bufferedRanges: getBufferedRanges(audio),
        duration: audio.duration || 0,
      });
    };

    const handleLoadStart = () => {
      updateDebug({
        loadingState: 'load-started',
        lastEvent: 'loadstart',
        loadStartTime: Date.now(),
      });
      updateAudioState('loadstart');
    };

    const handleLoadedData = () => {
      updateDebug({
        loadingState: 'data-loaded',
        lastEvent: 'loadeddata',
      });
      updateAudioState('loadeddata');
    };

    const handleProgress = () => {
      updateAudioState('progress');
    };

    const handleSuspend = () => {
      updateDebug({
        loadingState: 'suspended',
        lastEvent: 'suspend',
      });
      updateAudioState('suspend');
    };

    const handleStalled = () => {
      updateDebug({
        loadingState: 'stalled',
        lastEvent: 'stalled',
      });
      updateAudioState('stalled');
    };

    const handleWaiting = () => {
      updateDebug({
        lastEvent: 'waiting',
      });
      updateAudioState('waiting');
    };

    const handleTimeUpdate = () => {
      // Only update current time if user is not scrubbing
      if (!isScrubbing) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      updateDebug({
        loadingState: 'metadata-loaded',
        lastEvent: 'loadedmetadata',
        duration: audio.duration,
      });
      updateAudioState('loadedmetadata');

      // On iOS, trigger loading after metadata is loaded
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isIOS && !debugInfo.iosLoadingTriggered) {
        // Wait a bit for iOS to settle, then trigger loading
        setTimeout(async () => {
          const loadingTriggered = await triggerIOSLoading(audio);
          if (loadingTriggered) {
            // After triggering loading, wait for canplaythrough and then auto-play
            const waitForCanPlayThrough = () => {
              if (audio.readyState >= 4) {
                // Audio is ready, try autoplay
                setTimeout(async () => {
                  try {
                    await audio.play();
                    setIsPlaying(true);
                    updateDebug({
                      autoplayAttempted: true,
                      autoplaySuccess: true,
                      loadingState: 'playing',
                      lastEvent: 'ios-autoplay-success',
                    });
                  } catch (err) {
                    console.error('iOS auto-play failed:', err);
                    updateDebug({
                      autoplayAttempted: true,
                      autoplayError:
                        err instanceof Error
                          ? err.message
                          : 'iOS autoplay failed',
                      autoplaySuccess: false,
                      lastEvent: 'ios-autoplay-failed',
                    });
                  }
                }, 500);
              } else {
                // Wait a bit more
                setTimeout(waitForCanPlayThrough, 100);
              }
            };
            waitForCanPlayThrough();
          }
        }, 1000);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      updateDebug({ lastEvent: 'ended' });
      if (onEnded) {
        onEnded();
      }
    };

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      const error = target.error;
      console.error('Audio playback error:', error);
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
      updateDebug({
        loadingState: 'error',
        autoplayError: error
          ? `${error.code}: ${error.message}`
          : 'Audio error event',
        lastEvent: 'error',
      });
      updateAudioState('error');
    };

    const handleCanPlay = () => {
      setError(null);
      updateDebug({
        canPlay: true,
        loadingState: 'can-play',
        lastEvent: 'canplay',
      });
      updateAudioState('canplay');
    };

    // Auto-play when audio finishes loading
    const handleCanPlayThrough = () => {
      updateDebug({
        canPlayThrough: true,
        loadingState: 'can-play-through',
        lastEvent: 'canplaythrough',
      });
      updateAudioState('canplaythrough');

      // Clear any existing timeout
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }

      // Auto-play after 500ms delay
      autoPlayTimeoutRef.current = setTimeout(async () => {
        updateDebug({
          autoplayAttempted: true,
          lastEvent: 'autoplay-attempt',
        });

        try {
          await audio.play();
          setIsPlaying(true);
          setError(null);
          updateDebug({
            autoplaySuccess: true,
            loadingState: 'playing',
            lastEvent: 'autoplay-success',
          });
        } catch (err) {
          console.error('Auto-play failed:', err);
          updateDebug({
            autoplayError:
              err instanceof Error ? err.message : 'Unknown autoplay error',
            autoplaySuccess: false,
            lastEvent: 'autoplay-failed',
          });
          // Don't set error here as it might be due to browser autoplay policy
          // User can still click play manually
        }
      }, 500);
    };

    // Add all event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('suspend', handleSuspend);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    // Set initial playback speed from store
    audio.playbackRate = playbackSpeed;

    // Preload metadata
    audio.preload = 'metadata';

    return () => {
      // Clear timeout on cleanup
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }

      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('suspend', handleSuspend);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [playbackSpeed, onEnded, isScrubbing]);

  // Reset current time and debug info when src changes
  useEffect(() => {
    setCurrentTime(0);
    updateDebug({
      loadingState: 'loading-new-src',
      autoplayAttempted: false,
      autoplaySuccess: false,
      autoplayError: null,
      canPlay: false,
      canPlayThrough: false,
      lastEvent: 'src-changed',
      iosLoadingTriggered: false,
    });
  }, [src]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  const togglePlayPause = async () => {
    if (isPlaying) {
      await handlePause();
    } else {
      await handlePlay();
    }
  };

  // Handle when user starts scrubbing
  const handleScrubStart = () => {
    setIsScrubbing(true);

    // Pause if playing to make scrubbing smoother
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Handle when user finishes scrubbing
  const handleScrubEnd = () => {
    setIsScrubbing(false);

    // Resume playback if it was playing before
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error('Error resuming playback after scrub:', err);
      });
    }
  };

  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current || !value.length) return;

    const newTime = value[0];

    // Update the current time state immediately for smoother UI
    setCurrentTime(newTime);

    // Only update the actual audio time if the value has changed significantly
    if (Math.abs(audioRef.current.currentTime - newTime) > 0.5) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = (value: string) => {
    if (!audioRef.current) return;
    const speed = parseFloat(value);
    audioRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-lg border-2 bg-card p-4',
        className,
      )}
      {...props}
    >
      {/* Debug Information */}
      {/* <div className='bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono'>
        <div className='font-bold mb-2'>
          Audio Debug Info ({debugInfo.timestamp})
        </div>
        <div>Loading State: {debugInfo.loadingState}</div>
        <div>Last Event: {debugInfo.lastEvent}</div>
        <div>Can Play: {debugInfo.canPlay ? 'Yes' : 'No'}</div>
        <div>Can Play Through: {debugInfo.canPlayThrough ? 'Yes' : 'No'}</div>
        <div>
          Autoplay Attempted: {debugInfo.autoplayAttempted ? 'Yes' : 'No'}
        </div>
        <div>Autoplay Success: {debugInfo.autoplaySuccess ? 'Yes' : 'No'}</div>
        {debugInfo.autoplayError && (
          <div className='text-red-600'>
            Autoplay Error: {debugInfo.autoplayError}
          </div>
        )}
        <div className='mt-2 text-gray-600 dark:text-gray-400'>
          User Agent:{' '}
          {debugInfo.userAgent.includes('iPhone') ? 'iPhone' : 'Other'}
        </div>
        <div>
          Network State:{' '}
          {getNetworkStateText(audioRef.current?.networkState || 0)}
        </div>
        <div>
          Ready State: {getReadyStateText(audioRef.current?.readyState || 0)}
        </div>
        <div>
          Buffered Ranges: {getBufferedRanges(audioRef.current || new Audio())}
        </div>
        <div>Duration: {debugInfo.duration.toFixed(2)} seconds</div>
        <div>Current Source: {debugInfo.currentSrc}</div>
        <div>
          Load Start Time:{' '}
          {debugInfo.loadStartTime
            ? new Date(debugInfo.loadStartTime).toLocaleTimeString()
            : 'N/A'}
        </div>
        <div>
          iOS Loading Triggered: {debugInfo.iosLoadingTriggered ? 'Yes' : 'No'}
        </div>
      </div> */}

      <audio ref={audioRef} src={src} />

      {error && (
        <div className='text-sm text-destructive text-center'>{error}</div>
      )}

      {/* First row - General info and volume control */}
      <div className='flex items-center justify-between gap-x-2 gap-y-4 flex-wrap'>
        <div className='flex items-center space-x-2'>
          <Select
            value={playbackSpeed.toString()}
            onValueChange={handleSpeedChange}
          >
            <SelectTrigger className='h-8 w-28 gap-0'>
              <Gauge className='mr-2 h-3 w-3' />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLAYBACK_SPEEDS.map((speed) => (
                <SelectItem key={speed.value} value={speed.value}>
                  {speed.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleMute}
            className='h-8 w-8'
          >
            {isMuted ? (
              <VolumeX className='h-4 w-4' />
            ) : (
              <Volume2 className='h-4 w-4' />
            )}
          </Button>

          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className='w-24'
          />
        </div>
      </div>

      {/* Second row - Media player controls */}
      <div className='flex items-center justify-between'>
        <Button
          variant='ghost'
          size='icon'
          onClick={togglePlayPause}
          className='h-8 w-8'
        >
          {isPlaying ? (
            <Pause className='h-4 w-4' />
          ) : (
            <Play className='h-4 w-4' />
          )}
        </Button>

        <div className='flex flex-1 items-center space-x-2 pl-4'>
          <span className='w-12 text-sm tabular-nums'>
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleTimeChange}
            onValueCommit={handleScrubEnd}
            onPointerDown={handleScrubStart}
            className='w-full'
          />
          <span className='w-12 text-sm tabular-nums text-right'>
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
