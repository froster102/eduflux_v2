import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/instructor/_layout/sessions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello &quot;/instructor/_layout/sessions/&quot;!</div>;
}
