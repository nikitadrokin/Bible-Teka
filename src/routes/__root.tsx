import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import TanstackQueryLayout from '../integrations/tanstack-query/layout';

import appCss from '../styles.css?url';

import type { QueryClient } from '@tanstack/react-query';

import type { TRPCRouter } from '@/integrations/trpc/router';
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { BibleProvider } from '@/components/bible/BibleContext';

interface MyRouterContext {
  queryClient: QueryClient;

  trpc: TRPCOptionsProxy<TRPCRouter>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Bible Teka',
        description: 'Clone of Bible Teka for personal use',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: () => (
    <RootDocument>
      <div className='texture' />
      <BibleProvider>
        <Outlet />
      </BibleProvider>
      <TanStackRouterDevtools />

      <TanstackQueryLayout />
    </RootDocument>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
      </head>
      <body className='bg-background text-foreground'>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
