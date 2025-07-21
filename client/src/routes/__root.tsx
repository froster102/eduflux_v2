import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <main className="max-h-dvh h-full w-full flex flex-col">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
