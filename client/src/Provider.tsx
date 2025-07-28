import { HeroUIProvider } from "@heroui/system";
import { addToast, ToastProvider } from "@heroui/toast";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AxiosError } from "axios";

import { routeTree } from "./routeTree.gen.ts";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error: AxiosError<ApiErrorResponse> | Error) => {
      if (error instanceof AxiosError) {
        addToast({
          description:
            error.response?.data.message || "An unexpected error has occured",
          color: "danger",
        });
      }
    },
  }),
});

const router = createRouter({ routeTree, context: { queryClient } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function Provider({ children }: { children?: React.ReactNode }) {
  return (
    <HeroUIProvider className="h-full">
      <ToastProvider placement={"top-right"} />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {children}
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
