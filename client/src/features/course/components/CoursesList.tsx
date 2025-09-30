import CourseCard from "@/components/CourseCard";
import PaginationWithNextAndPrevious from "@/components/Pagination";

interface CoursesListProps {
  courses: Course[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  type: "all-course" | "my-courses";
  onCoursePress: (course: Course) => void;
}

export default function CoursesList({
  courses,
  currentPage,
  onPageChange,
  totalPages,
  type,
  onCoursePress,
}: CoursesListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isSubscribed={type === "my-courses"}
            onPress={() => {
              if (onCoursePress) {
                onCoursePress(course);
              }
            }}
          />
        ))}
      </div>
      <div className="pt-4 flex w-full justify-center">
        {totalPages > 1 && (
          <PaginationWithNextAndPrevious
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}
