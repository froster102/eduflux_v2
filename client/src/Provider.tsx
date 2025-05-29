import type { NavigateOptions } from "react-router";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router";
import { ToastProvider } from "@heroui/toast";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Provider({ children }: { children: React.ReactNode }) {
  // const isMobile = useDeviceType();

  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider placement={"top-right"} />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HeroUIProvider>
  );
}
