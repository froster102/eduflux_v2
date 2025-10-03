import { createFileRoute } from "@tanstack/react-router";

import VideoConference from "@/features/meetings/components/VideoConference";
import { Role } from "@/shared/enums/Role";

export const Route = createFileRoute(
  "/instructor/_layout/sessions/join/$sessionId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <VideoConference
      roomId={Route.useParams().sessionId}
      userRole={Role.INSTRUCTOR}
    />
  );
}
