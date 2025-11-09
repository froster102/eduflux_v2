import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { Chip } from '@heroui/chip';

import { formatSessionDataTime } from '@/utils/date';
import { useGetUserSessions } from '@/features/session/hooks/useGetUserSessions';
import { Role } from '@/shared/enums/Role';
import { getSessionStatusColor } from '@/lib/utils';
import { SessionStatus } from '@/shared/enums/SessionStatus';

interface UpcomingSessionSectionProps {
  preferedRole: Role.INSTRUCTOR | Role.LEARNER;
  onViewAll: () => void;
}

export default function UpcomingSessionSection({
  preferedRole,
  onViewAll,
}: UpcomingSessionSectionProps) {
  const { data: upcomingSessions, isLoading: isUpcomingSessionLoading } =
    useGetUserSessions({
      page: {
        number: 1,
        size: 5,
      },
      filter: {
        preferedRole: preferedRole,
        sort: '-startTime',
        status: SessionStatus.CONFIRMED,
      },
    });

  return (
    <Card className="p-4 bg-background border border-default-300" shadow="none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upcoming sessions</h3>
        <Button size="sm" variant="ghost" onPress={onViewAll}>
          View All
        </Button>
      </div>
      {isUpcomingSessionLoading ? (
        <div className="flex w-full justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-2">
          {upcomingSessions &&
            upcomingSessions.data.map((session) => {
              const { date } = formatSessionDataTime(
                session.startTime,
                session.endTime,
              );

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-2 hover:bg-default-100 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Chip
                      className="capitalize"
                      color={getSessionStatusColor(session.status)}
                    >
                      {session.status}
                    </Chip>
                    <span>
                      Session with {session.learner.name} on {date}
                    </span>
                  </div>
                  {/* <Icon
                  className="text-default-500"
                  icon="solar:arrow-right-outline"
                /> */}
                </div>
              );
            })}
        </div>
      )}
    </Card>
  );
}
