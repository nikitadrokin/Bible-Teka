import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWakeLockOptions {
  /**
   * Whether to automatically restore wake lock when the page becomes visible again
   * @default true
   */
  restoreOnVisibilityChange?: boolean;
  /**
   * Whether wake lock is enabled/disabled by user preference
   * @default true
   */
  enabled?: boolean;
}

interface UseWakeLockReturn {
  /** Whether wake lock is currently active */
  isActive: boolean;
  /** Whether wake lock API is supported in current browser */
  isSupported: boolean;
  /** Request wake lock (if enabled) */
  request: () => Promise<boolean>;
  /** Release wake lock */
  release: () => void;
  /** Toggle wake lock on/off */
  toggle: () => Promise<boolean>;
}

/**
 * Hook for managing Screen Wake Lock API to prevent screen from dimming/locking
 * Particularly useful during audio playback to keep the screen active
 */
export function useWakeLock({
  restoreOnVisibilityChange = true,
  enabled = true,
}: UseWakeLockOptions = {}): UseWakeLockReturn {
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Check if wake lock is supported
  const isSupported =
    'wakeLock' in navigator && 'request' in navigator.wakeLock;

  const release = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
      setIsActive(false);
    }
  }, []);

  const request = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !enabled) {
      return false;
    }

    try {
      // Release existing wake lock first
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }

      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsActive(true);

      // Handle wake lock release (e.g., when tab loses focus)
      wakeLockRef.current.addEventListener('release', () => {
        setIsActive(false);
        wakeLockRef.current = null;
      });

      return true;
    } catch (error) {
      console.warn('Failed to request wake lock:', error);
      setIsActive(false);
      wakeLockRef.current = null;
      return false;
    }
  }, [isSupported, enabled]);

  const toggle = useCallback(async (): Promise<boolean> => {
    if (isActive) {
      release();
      return false;
    } else {
      return await request();
    }
  }, [isActive, request, release]);

  // Handle visibility change to restore wake lock
  useEffect(() => {
    if (!restoreOnVisibilityChange || !isSupported || !enabled) {
      return;
    }

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          request();
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [restoreOnVisibilityChange, isSupported, enabled, request]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      release();
    };
  }, [release]);

  return {
    isActive,
    isSupported,
    request,
    release,
    toggle,
  };
}
