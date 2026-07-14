import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useYVAuth } from '@youversion/platform-react-hooks';
import { YouVersionClientProvider } from '@/integrations/youversion/provider';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const { t } = useTranslation();

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <YouVersionClientProvider
        fallback={<p className='text-muted-foreground'>{t('signingIn')}</p>}
      >
        <CallbackHandler />
      </YouVersionClientProvider>
    </div>
  );
}

function CallbackHandler() {
  const { auth } = useYVAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // YouVersionProvider exchanges the OAuth code automatically on mount; once
  // it settles without an error, return to the app.
  useEffect(() => {
    if (!auth.isLoading && !auth.error) {
      navigate({ to: '/', replace: true });
    }
  }, [auth.isLoading, auth.error, navigate]);

  if (auth.error) {
    return (
      <div className='flex flex-col items-center gap-4 text-center'>
        <p className='text-destructive'>{t('signInFailed')}</p>
        <Button onClick={() => navigate({ to: '/', replace: true })}>
          {t('backToApp')}
        </Button>
      </div>
    );
  }

  return <p className='text-muted-foreground'>{t('signingIn')}</p>;
}
