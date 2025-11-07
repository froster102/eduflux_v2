import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Avatar } from '@heroui/avatar';
import { Spinner } from '@heroui/spinner';

import { IMAGE_BASE_URL } from '@/config/image';
// eslint-disable-next-line boundaries/element-types
import { useGetInstructors } from '@/features/instructor/hooks/useGetInstructors';

interface TopInstructorsCardProps {
  onViewAll?: () => void;
}

export default function TopInstructorsCard({
  onViewAll,
}: TopInstructorsCardProps) {
  const { data: topInstructors, isLoading: isTopInstructorsLoading } =
    useGetInstructors({
      page: {
        number: 1,
        size: 5,
      },
      filter: {
        isSchedulingEnabled: false,
        sort: '-totalLearners',
      },
    });

  return (
    <Card className="p-4 bg-background border border-default-300" shadow="none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Top Instructors</h3>
        {onViewAll && (
          <Button size="sm" variant="ghost" onPress={onViewAll}>
            View All
          </Button>
        )}
      </div>
      {isTopInstructorsLoading ? (
        <div className="flex justify-center w-full py-8">
          <Spinner />
        </div>
      ) : topInstructors && topInstructors.data.length > 0 ? (
        <div className="space-y-2">
          {topInstructors.data.map((instructor) => (
            <div
              key={instructor.id}
              className="flex items-center gap-3 p-2 hover:bg-default-100 rounded cursor-pointer transition-colors"
            >
              <Avatar
                isBordered
                radius="md"
                size="md"
                src={
                  instructor.profile.image
                    ? `${IMAGE_BASE_URL}${instructor.profile.image}`
                    : undefined
                }
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">
                  {instructor.profile.name}
                </h4>
                <p className="text-xs text-default-500 line-clamp-1">
                  {instructor.profile.bio}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-default-600">
                    {instructor.totalCourses} courses
                  </span>
                  <span className="text-xs text-default-600">
                    {instructor.totalLearners.toLocaleString()} learners
                  </span>
                  <span className="text-xs text-default-600">
                    {instructor.sessionsConducted} sessions
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-8">
          <p className="text-sm text-default-500">
            No instructors available at the moment
          </p>
        </div>
      )}
    </Card>
  );
}

