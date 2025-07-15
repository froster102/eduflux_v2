import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_layout/courses/$courseId/learn/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();

  return <div>Hello "/learner/_layout/courses/$courseId/learn/"!</div>;
}
