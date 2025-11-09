import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { User } from '@heroui/user';
import { Chip } from '@heroui/chip';

import { IMAGE_BASE_URL } from '@/config/image';
import ClockIcon from '@/components/icons/ClockIcon';
import { formatSessionDataTime } from '@/utils/date';
import VideoIcon from '@/components/icons/VideoIcon';
import { Role } from '@/shared/enums/Role';
import { getSessionStatusColor } from '@/lib/utils';

interface SessionCardProps {
  session: UserSession;
  onJoin: (session: UserSession) => void;
  role: Role;
}

export default function SessionCard({
  session,
  onJoin,
  role,
}: SessionCardProps) {
  const { date, duration, timeRange } = formatSessionDataTime(
    session.startTime,
    session.endTime,
  );

  return (
    <div key={session.id} className={`pt-2`}>
      <Card className="border bg-background border-default-300 " shadow="none">
        <CardBody>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <User
                  avatarProps={{
                    size: 'sm',
                    src: `${IMAGE_BASE_URL}${session.instructor.image}`,
                  }}
                  name={`${role === Role.LEARNER ? session.instructor.name : session.learner.name}`}
                />
                <Chip
                  className="text-xs capitalize"
                  color={getSessionStatusColor(session.status)}
                  size="sm"
                  variant="flat"
                >
                  {session.status.toLowerCase().replace('_', ' ')}
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
            {/* <Button
              className="text-sm"
              color="primary"
              size="sm"
              startContent={<ReviewIcon width={16} />}
              variant="bordered"
            >
              <p className="text-sm">Write a review</p>
            </Button> */}
            <Button
              color="primary"
              size="sm"
              startContent={<VideoIcon width={18} />}
              onPress={() => {
                onJoin(session);
              }}
            >
              Join
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
