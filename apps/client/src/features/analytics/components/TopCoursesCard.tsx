import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Image } from '@heroui/image';
import { Spinner } from '@heroui/spinner';

import { IMAGE_BASE_URL } from '@/config/image';
// eslint-disable-next-line boundaries/element-types
import { useGetCourses } from '@/features/course/hooks/useGetCourses';

interface TopCoursesCardProps {
  onViewAll?: () => void;
}

export default function TopCoursesCard({ onViewAll }: TopCoursesCardProps) {
  const { data: topCourses, isPending: isTopCoursesLoading } = useGetCourses({
    page: {
      number: 1,
      size: 5,
    },
    filter: {
      sort: '-enrollmentCount',
    },
  });

  return (
    <Card className="p-4 bg-background border border-default-300" shadow="none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Top Courses</h3>
        {onViewAll && (
          <Button size="sm" variant="ghost" onPress={onViewAll}>
            View All
          </Button>
        )}
      </div>
      {isTopCoursesLoading ? (
        <div className="flex justify-center w-full py-8">
          <Spinner />
        </div>
      ) : topCourses && topCourses.data.length > 0 ? (
        <div className="space-y-2">
          {topCourses.data.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-3 p-2 hover:bg-default-100 rounded cursor-pointer transition-colors"
            >
              <Image
                alt={course.title}
                className="object-cover rounded-md"
                height={60}
                src={
                  course.thumbnail
                    ? `${IMAGE_BASE_URL}${course.thumbnail}`
                    : '/placeholder.png'
                }
                width={80}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm line-clamp-1">
                  {course.title}
                </h4>
                <p className="text-xs text-default-500">
                  by {course.instructor.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-default-600">
                    {course.enrollmentCount.toLocaleString()} students
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-8">
          <p className="text-sm text-default-500">
            No courses available at the moment
          </p>
        </div>
      )}
    </Card>
  );
}
