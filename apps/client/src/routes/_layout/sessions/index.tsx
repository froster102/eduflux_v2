import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

import { sessionSearchSchema } from "@/features/session/schemas/session-search.schema";
import BookingStatusModal from "@/features/session/components/BookingStatusModal";
import { useGetUserSessions } from "@/features/session/hooks/useGetUserSessions";
import PaginationWithNextAndPrevious from "@/components/Pagination";
import { Role } from "@/shared/enums/Role";
import SessionCard from "@/features/session/components/SessionCard";

export const Route = createFileRoute("/_layout/sessions/")({
  validateSearch: sessionSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const [openBookingStatusModal, setOpenBookingStatusModal] = React.useState(
    Object.values(searchParams).length > 0,
  );
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const { data: sessionsQueryResult } = useGetUserSessions({
    page: {
      number: page,
    },
    filter: {
      preferedRole: Role.LEARNER,
    },
  });

  const handlerJoinSession = (session: UserSession) => {
    navigate({
      to: `/meetings/${session.id}?returnTo=/sessions`,
      replace: true,
    });
  };

  return (
    <>
      <div>
        {sessionsQueryResult &&
          sessionsQueryResult.data.map((session) => (
            <SessionCard
              key={session.id}
              role={Role.LEARNER}
              session={session}
              onJoin={handlerJoinSession}
            />
          ))}
        {sessionsQueryResult && sessionsQueryResult.meta.totalPages > 1 && (
          <div className="pt-4 flex w-full justify-center">
            <PaginationWithNextAndPrevious
              currentPage={sessionsQueryResult.meta.pageNumber}
              totalPages={sessionsQueryResult.meta.totalPages}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        )}
      </div>
      <BookingStatusModal
        bookingStatus={searchParams}
        isOpen={openBookingStatusModal}
        onClose={() => {
          setOpenBookingStatusModal(false);
          navigate({ to: "/sessions" });
        }}
        onOpenChange={setOpenBookingStatusModal}
      />
    </>
  );
}
