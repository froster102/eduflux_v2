import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { useNavigate } from '@tanstack/react-router';
import { Spinner } from '@heroui/spinner';

import CourseCard from '@/components/CourseCard';
import { useGetInstructorCourses } from '@/features/course/hooks/useGetInstructorCourses';

export default function InstructorCoursesSection() {
  const navigate = useNavigate();

  const { data: instructorCourses, isLoading: isInstructorCourseLoading } =
    useGetInstructorCourses({
      page: {
        number: 1,
        size: 5,
      },
    });

  const coursePressHandler = (courseId: string) => {
    navigate({ to: `/instructor/courses/${courseId}/manage` });
  };

  return (
    <Card
      className="p-4 border border-default-300 bg-background h-full"
      shadow="none"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your courses</h3>
        <Button
          size="sm"
          variant="ghost"
          onPress={() => {
            navigate({ to: '/instructor/courses' });
          }}
        >
          View All
        </Button>
      </div>
      {isInstructorCourseLoading ? (
        <div className="flex justify-center w-full">
          <Spinner />
        </div>
      ) : instructorCourses.data.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <div className="max-w-md">
            <p>
              Currently you have not created any course,Please move to course
              section to create courses.
            </p>
            <Button
              className="w-fit"
              color="primary"
              size="sm"
              onPress={() => {
                navigate({ to: '/instructor/courses' });
              }}
            >
              Go to course section
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {instructorCourses.data.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isInstructorCourse={true}
              isSubscribed={false}
              onPress={() => {
                coursePressHandler(course.id);
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
