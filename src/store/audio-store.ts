import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioStore {
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      playbackSpeed: 1,
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
    }),
    {
      name: 'bible-teka-audio-settings',
    },
  ),
);
