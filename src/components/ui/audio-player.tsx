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

interface AudioPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
}

const PLAYBACK_SPEEDS = [
  { value: '1', label: '1x' },
  { value: '1.1', label: '1.1x' },
  { value: '1.2', label: '1.2x' },
  { value: '1.25', label: '1.25x' },
  { value: '1.5', label: '1.5x' },
  { value: '2', label: '2x' },
] as const;

export function AudioPlayer({ src, className, ...props }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playbackSpeed, setPlaybackSpeed } = useAudioStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: ErrorEvent) => {
      console.error('Audio playback error:', e);
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
    };
    const handleCanPlay = () => {
      setError(null);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Set initial playback speed from store
    audio.playbackRate = playbackSpeed;

    // Preload metadata
    audio.preload = 'metadata';

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [playbackSpeed]);

  // Auto-play when src changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset current time when src changes
    setCurrentTime(0);

    // Attempt to play audio when src changes
    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setError(null);
      } catch (err) {
        console.error('Auto-play failed:', err);
        // Don't set error here as it might be due to browser autoplay policy
        // User can still click play manually
      }
    };

    // Audio needs to be loaded before we can play it
    const handleCanPlayAutoPlay = () => {
      playAudio();
      // Remove event listener after first trigger
      audio.removeEventListener('canplaythrough', handleCanPlayAutoPlay);
    };

    audio.addEventListener('canplaythrough', handleCanPlayAutoPlay);

    // Clean up
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayAutoPlay);
    };
  }, [src]);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setError(null);
    } catch (err) {
      console.error('Playback error:', err);
      setError('Failed to play audio. Please try again.');
      setIsPlaying(false);
    }
  };

  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
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
            <SelectTrigger className='h-8 w-28'>
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
