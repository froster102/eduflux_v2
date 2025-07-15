import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/instructor/_layout/sessions/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/instructor/_layout/sessions/"!</div>
}
