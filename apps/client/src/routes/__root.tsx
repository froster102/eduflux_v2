import type { QueryClient } from '@tanstack/react-query';

import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <>
      <main className="max-h-dvh h-full w-full flex flex-col">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
