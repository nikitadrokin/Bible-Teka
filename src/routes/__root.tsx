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

const siteUrl = 'https://bibleteka.nkdr.me/';
const siteTitle = 'БиблияТека — аудиобиблия на русском языке';
const siteDescription =
  'Слушайте и читайте Библию на русском языке: выбирайте книгу и главу, включайте аудио и продолжайте с того места, где остановились.';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'БиблияТека',
  url: siteUrl,
  description: siteDescription,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'ru',
  isAccessibleForFree: true,
  author: {
    '@type': 'Person',
    name: 'Nikita Drokin',
    url: 'https://nikitadrokin.com/',
  },
};

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
        : siteTitle;

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
        title: siteTitle,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        name: 'author',
        content: 'Nikita Drokin',
      },
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:locale',
        content: 'ru_RU',
      },
      {
        property: 'og:site_name',
        content: 'БиблияТека',
      },
      {
        property: 'og:title',
        content: siteTitle,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:url',
        content: siteUrl,
      },
      {
        property: 'og:image',
        content: `${siteUrl}logo.png`,
      },
      {
        property: 'og:image:alt',
        content: 'Логотип БиблияТеки',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:title',
        content: siteTitle,
      },
      {
        name: 'twitter:description',
        content: siteDescription,
      },
      {
        name: 'twitter:image',
        content: `${siteUrl}logo.png`,
      },
      {
        name: 'theme-color',
        content: '#e6d8b8',
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
        rel: 'canonical',
        href: siteUrl,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
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
      <div className="texture" />
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
    <html lang="ru">
      <head>
        <HeadContent />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
