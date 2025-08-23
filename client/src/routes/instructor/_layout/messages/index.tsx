import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/instructor/_layout/messages/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello &quot;/instructor/_layout/messages/&quot;!</div>;
}
