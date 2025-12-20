import { useEffect } from 'react';

interface UseAudioShortcutsProps {
  onPlayPause: () => void;
}

export function useAudioShortcuts({ onPlayPause }: UseAudioShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Ignore if user is typing in an input, textarea, or content editable
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.tagName === 'SELECT';

      // Ignore if user is interacting with a button or link to avoid conflicts/double-actions
      const isInteractive = target.tagName === 'BUTTON' || target.tagName === 'A';

      if (isInput || isInteractive) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onPlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause]);
}
