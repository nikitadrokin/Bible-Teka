const IOS_USER_AGENT_PATTERN = /iPhone|iPod|iPad/;

/**
 * Detects iOS devices, including iPadOS Safari in desktop mode where the
 * user agent reports as Macintosh but touch points are available.
 */
export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  if (IOS_USER_AGENT_PATTERN.test(navigator.userAgent)) {
    return true;
  }

  return navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent);
}

/**
 * Detects macOS desktop browsers (Safari, Chrome, etc.) that are not iOS/iPadOS.
 */
export function isMacOSDesktop(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  if (isIOSDevice()) {
    return false;
  }

  return /Mac/.test(navigator.userAgent);
}

/**
 * iOS and iPadOS need the play/pause loading workaround before autoplay.
 * Desktop macOS uses the standard canplaythrough autoplay path instead.
 *
 * Viewport size is intentionally not used here: macOS typically has a large
 * viewport and must not be routed through the iOS workaround.
 */
export function needsRestrictedAutoplayWorkaround(): boolean {
  return isIOSDevice();
}

/**
 * Desktop browsers (including macOS) that can use canplaythrough autoplay.
 */
export function usesDesktopAutoplay(): boolean {
  return !needsRestrictedAutoplayWorkaround();
}
