import { describe, expect, it } from 'vitest';
import {
  isIOSDevice,
  isMacOSDesktop,
  needsRestrictedAutoplayWorkaround,
  usesDesktopAutoplay,
} from './device-detection';

type NavigatorOverrides = {
  userAgent: string;
  maxTouchPoints?: number;
};

function withNavigator(
  overrides: NavigatorOverrides,
  run: () => void,
): void {
  const originalNavigator = globalThis.navigator;

  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      ...originalNavigator,
      userAgent: overrides.userAgent,
      maxTouchPoints: overrides.maxTouchPoints ?? 0,
    },
  });

  try {
    run();
  } finally {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: originalNavigator,
    });
  }
}

describe('device detection', () => {
  it('detects iPhone user agents as iOS', () => {
    withNavigator(
      {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      },
      () => {
        expect(isIOSDevice()).toBe(true);
        expect(isMacOSDesktop()).toBe(false);
        expect(needsRestrictedAutoplayWorkaround()).toBe(true);
        expect(usesDesktopAutoplay()).toBe(false);
      },
    );
  });

  it('detects iPadOS desktop mode via touch points', () => {
    withNavigator(
      {
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        maxTouchPoints: 5,
      },
      () => {
        expect(isIOSDevice()).toBe(true);
        expect(isMacOSDesktop()).toBe(false);
        expect(needsRestrictedAutoplayWorkaround()).toBe(true);
      },
    );
  });

  it('detects macOS desktop Safari as desktop autoplay', () => {
    withNavigator(
      {
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        maxTouchPoints: 0,
      },
      () => {
        expect(isIOSDevice()).toBe(false);
        expect(isMacOSDesktop()).toBe(true);
        expect(needsRestrictedAutoplayWorkaround()).toBe(false);
        expect(usesDesktopAutoplay()).toBe(true);
      },
    );
  });
});
