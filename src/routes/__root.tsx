import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router';

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
        title: 'БиблияТека',
        description: 'Аудио Библия на русском языке',
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
    scripts: [
      {
        src: 'https://umami.nkdr.me/script.js',
        defer: true,
        'data-website-id': '04657830-aad7-45ac-bf50-fca6b728fa22',
      },
    ],
  }),

  component: () => (
    <RootDocument>
      <div className='texture' />
      <NuqsAdapter>
        <BibleProvider>
          <DynamicTitle />
          <Outlet />
        </BibleProvider>
      </NuqsAdapter>
    </RootDocument>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // check what's causing this incorrect bg color to be applied
    <html lang='ru'>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
