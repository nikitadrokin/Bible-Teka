import { createRouter as createTanstackRouter, useRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import * as TanstackQuery from './integrations/tanstack-query/root-provider';
import { useEffect } from 'react';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import './styles.css';
import './lib/i18n'; // Import i18n configuration

// NotFound component that redirects to root
function NotFound() {
  const router = useRouter();
  
  useEffect(() => {
    router.navigate({ to: '/' });
  }, [router]);
  
  return null;
}

// Create a new router instance
export const createRouter = () => {
  const router = routerWithQueryClient(
    createTanstackRouter({
      routeTree,
      context: {
        ...TanstackQuery.getContext(),
      },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      defaultNotFoundComponent: NotFound,

      Wrap: (props: { children: React.ReactNode }) => {
        return (
          <TanstackQuery.Provider>{props.children}</TanstackQuery.Provider>
        );
      },
    }),
    TanstackQuery.getContext().queryClient,
  );

  return router;
};

let router: ReturnType<typeof createRouter> | null = null;

export const getRouter = async () => {
  if (!router) {
    router = createRouter();
  }

  return router;
};

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
