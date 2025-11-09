import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { useNavigate } from '@tanstack/react-router';

import { useGetCourses } from '@/features/course/hooks/useGetCourses';
import CourseCard from '@/components/CourseCard';

interface TopCoursesProps {
  onViewAll: () => void;
}

export default function TopCoursesSection({ onViewAll }: TopCoursesProps) {
  const navigate = useNavigate();
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
        <Button size="sm" variant="ghost" onPress={onViewAll}>
          View All
        </Button>
      </div>
      {isTopCoursesLoading ? (
        <div className="flex justify-center w-full">
          <Spinner />
        </div>
      ) : topCourses!.data.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <div className="max-w-md">
            <p className="text-default-500">
              Currently you there are no available course at the moment
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCourses!.data.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isInstructorCourse={true}
              onPress={() => {
                navigate({ to: `/courses/${course.id}` });
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
