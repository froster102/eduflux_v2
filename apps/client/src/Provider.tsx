import { HeroUIProvider } from '@heroui/system';
import { addToast, ToastProvider } from '@heroui/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { NotificationProvider } from '@/context/NotificationContext.tsx';

import { routeTree } from './routeTree.gen.ts';
import { DEFAULT_ERROR_MESSAGE } from './config/error-messages.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: AxiosError<JsonApiErrorResponse> | Error) => {
        if (error instanceof AxiosError) {
          addToast({
            description:
              (error.response?.data as JsonApiErrorResponse).errors[0].title ||
              DEFAULT_ERROR_MESSAGE,
            color: 'danger',
          });
        } else if (error instanceof Error) {
          addToast({
            description: error.message || DEFAULT_ERROR_MESSAGE,
            color: 'danger',
          });
        }
      },
    },
  },
});

const router = createRouter({ routeTree, context: { queryClient } });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function Provider({ children }: { children?: React.ReactNode }) {
  return (
    <HeroUIProvider className="h-full">
      <ToastProvider placement={'top-right'} />
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <RouterProvider router={router} />
          {children}
        </NotificationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
