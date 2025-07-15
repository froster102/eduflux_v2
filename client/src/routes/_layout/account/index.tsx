import { createFileRoute } from "@tanstack/react-router";

import Account from "@/features/account/components/Account";

export const Route = createFileRoute("/_layout/account/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Account />;
}
