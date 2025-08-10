import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { createFileRoute } from "@tanstack/react-router";
import debounce from "lodash.debounce";
import React from "react";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";

import { SearchIcon } from "@/components/Icons";
import CourseListCard from "@/features/instructor/courses/components/CourseListCard";
import { useGetInstructorCourses } from "@/features/instructor/courses/hooks/useGetInstructorCourses";
import FormModal from "@/components/FormModal";
import CreateCourseForm from "@/features/instructor/courses/components/forms/CreateCourseForm";
import { useCreateCourse } from "@/features/instructor/courses/hooks/useCreateCourse";

export const Route = createFileRoute("/instructor/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const createCourse = useCreateCourse();

  const { data, isLoading } = useGetInstructorCourses({
    page,
    limit,
    searchFields: ["title"],
    searchQuery,
  });

  const [openCreateCourseModal, setOpenCreateCourseModal] =
    React.useState(false);

  const debouncedSetSearchQuery = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
      }, 500),
    [],
  );

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  function onCreateCourseHandler(data: CreateCourseFormData) {
    createCourse.mutate(data);
    setOpenCreateCourseModal(false);
  }

  return (
    <>
      <div>
        <p className="text-3xl font-bold">Courses</p>
        <small className="text-sm text-default-500">
          Below are the list of your courses
        </small>
      </div>
      <Divider className="mt-2" orientation="horizontal" />
      <div className="max-w-6xl w-full overflow-y-auto scrollbar-hide">
        <div className="flex pt-4 justify-between items-center">
          <Input
            isClearable
            className="w-full max-w-md"
            color="default"
            placeholder={`Search`}
            startContent={<SearchIcon />}
            onValueChange={debouncedSetSearchQuery}
          />
          <Button
            color="primary"
            onPress={() => setOpenCreateCourseModal(true)}
          >
            New Course
          </Button>
        </div>
        <div className="pt-4">
          {isLoading ? (
            <div className="flex w-full h-screen justify-center items-center">
              <Spinner />
            </div>
          ) : (
            data &&
            data.courses.map((course, i) => (
              <div key={course.id} className={`${i !== 0} pt-4`}>
                <CourseListCard course={course} />
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center pt-4 items-center gap-2">
          {data && data.total ? (
            <>
              <Button
                className="mr-2"
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
              >
                Previous
              </Button>
              <Pagination
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
              <div className="flex gap-2">
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  onPress={() =>
                    setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                  }
                >
                  Next
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <FormModal
        form={
          <CreateCourseForm
            isPending={createCourse.isPending}
            onCancel={() => setOpenCreateCourseModal(false)}
            onSubmitHandler={onCreateCourseHandler}
          />
        }
        isOpen={openCreateCourseModal}
        title={`Create your course`}
        onClose={() => setOpenCreateCourseModal(false)}
      />
    </>
  );
}
