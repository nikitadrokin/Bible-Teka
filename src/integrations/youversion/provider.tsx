import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { YouVersionProvider } from '@youversion/platform-react-hooks';

const appKey = import.meta.env.VITE_YVP_APP_KEY as string | undefined;

export function isYouVersionConfigured(): boolean {
  return Boolean(appKey);
}

/**
 * The YouVersion SDK stores auth tokens in localStorage and processes OAuth
 * callback params from window.location, so the provider can only mount in the
 * browser. Until then (and when no app key is configured) the fallback renders.
 */
export function YouVersionClientProvider({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !appKey) {
    return <>{fallback}</>;
  }

  return (
    <YouVersionProvider
      appKey={appKey}
      includeAuth
      authRedirectUrl={`${window.location.origin}/auth/callback`}
    >
      {children}
    </YouVersionProvider>
  );
}
