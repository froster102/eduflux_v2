import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_layout/courses')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello &quot;/admin/_layout/courses&quot;!</div>;
}
