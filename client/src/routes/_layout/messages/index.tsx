import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/messages/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_layout/messages/"!</div>;
}
