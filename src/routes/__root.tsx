import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { useEffect } from 'react';

import appCss from '../styles.css?url';

import type { QueryClient } from '@tanstack/react-query';

import type { TRPCRouter } from '@/integrations/trpc/router';
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { BibleProvider, useBible } from '@/components/bible/BibleContext';
import { useTranslation } from 'react-i18next';

interface MyRouterContext {
  queryClient: QueryClient;

  trpc: TRPCOptionsProxy<TRPCRouter>;
}

function DynamicTitle() {
  const { selection } = useBible();
  const { t } = useTranslation();

  useEffect(() => {
    const title =
      selection.book && selection.chapter
        ? `${selection.book.name} ${selection.chapter} | ${t('appTitle')}`
        : t('appTitle');

    document.title = title;
  }, [selection.book, selection.chapter]);

  return null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'Bible Teka',
        description: 'Clone of Bible Teka for personal use',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon-180x180.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),

  component: () => (
    <RootDocument>
      <div className='texture' />
      <BibleProvider>
        <DynamicTitle />
        <Outlet />
      </BibleProvider>
    </RootDocument>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
      </head>
      <body className='bg-background text-foreground app-container'>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
