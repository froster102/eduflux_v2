import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";

import CourseCard from "@/components/CourseCard";

interface CoursesListProps {
  courses: Course[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  type: "all-course" | "my-courses";
}

export default function CoursesList({
  courses,
  currentPage,
  onPageChange,
  totalPages,
  type,
}: CoursesListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isSubscribed={type === "my-courses"}
          />
        ))}
      </div>
      <div className="pt-4 flex w-full justify-center">
        <>
          <Button
            className="mr-2"
            color="primary"
            isDisabled={currentPage === 1}
            size="sm"
            variant="flat"
            onPress={() =>
              onPageChange(currentPage > 1 ? currentPage - 1 : currentPage)
            }
          >
            Previous
          </Button>
          <Pagination
            color="primary"
            page={currentPage}
            total={totalPages}
            onChange={onPageChange}
          />
          <Button
            className="ml-2"
            color="primary"
            isDisabled={currentPage >= totalPages}
            size="sm"
            variant="flat"
            onPress={() =>
              onPageChange(
                currentPage < totalPages ? currentPage + 1 : currentPage,
              )
            }
          >
            Next
          </Button>
        </>
      </div>
    </div>
  );
}
