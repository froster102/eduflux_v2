import { Card, CardBody } from "@heroui/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import React from "react";

import VideoIcon from "@/components/icons/VideoIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import ReviewIcon from "@/components/icons/ReviewIcon";
import { sessionSearchSchema } from "@/features/session/schemas/session-search.schema";
import BookingStatusModal from "@/features/session/components/BookingStatusModal";
import { useGetUserSessions } from "@/features/session/hooks/useGetUserSessions";
import { formatSessionDataTime } from "@/utils/date";
import { IMAGE_BASE_URL } from "@/config/image";
import PaginationWithNextAndPrevious from "@/components/Pagination";

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
    page,
    type: "learner",
  });

  return (
    <>
      <div>
        {sessionsQueryResult &&
          sessionsQueryResult.sessions.map((session) => {
            const { date, duration, timeRange } = formatSessionDataTime(
              session.startTime,
              session.endTime,
            );

            return (
              <div key={session.id} className={`pt-2`}>
                <Card
                  className="border bg-background border-default-300 "
                  shadow="none"
                >
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <User
                            avatarProps={{
                              size: "sm",
                              src: `${IMAGE_BASE_URL}${session.instructor.image}`,
                            }}
                            name={`${session.instructor.name}`}
                          />
                          <Chip color="success" variant="flat">
                            {session.status}
                          </Chip>
                        </div>
                        <p>{date}</p>
                        <small>{timeRange}</small>
                        <p className="inline-flex text-xs items-center text-default-700 gap-1">
                          <ClockIcon width={16} />
                          {duration}
                        </p>
                        <p className="inline-flex text-xs items-center text-default-700 gap-1">
                          <VideoIcon width={16} />
                          App
                        </p>
                      </div>
                      <Button
                        className="text-sm"
                        color="primary"
                        size="sm"
                        startContent={<ReviewIcon width={16} />}
                        variant="bordered"
                      >
                        <p className="text-sm">Write a review</p>
                      </Button>
                      {/* <Button
                  color="primary"
                  size="sm"
                  startContent={<VideoIcon width={18} />}
                  >
                  Join
                  </Button> */}
                    </div>
                  </CardBody>
                </Card>
              </div>
            );
          })}
        {sessionsQueryResult &&
          sessionsQueryResult.pagination.totalPages > 1 && (
            <div className="pt-4 flex w-full justify-center">
              <PaginationWithNextAndPrevious
                currentPage={sessionsQueryResult.pagination.currentPage}
                totalPages={sessionsQueryResult.pagination.totalPages}
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
