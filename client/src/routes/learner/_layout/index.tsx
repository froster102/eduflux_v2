import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learner/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>learner</div>;
}
